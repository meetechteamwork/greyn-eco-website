const { Corporate } = require('../models/User');
const CorporateEmissions = require('../models/CorporateEmissions');
const mongoose = require('mongoose');

/** Exclude seed/sample data so only real user data is shown */
const NO_SEED = { source: { $ne: 'seed' } };

/**
 * Calculate CO2 emissions based on category and value
 */
function calculateCO2(category, value, valueNumeric) {
  // Standard conversion factors (in kg CO2 per unit)
  const factors = {
    electricity: 0.4, // kg CO2 per kWh (varies by country, using average)
    fuel: 2.31, // kg CO2 per liter of gasoline
    travel: 0.2, // kg CO2 per km (average for car travel)
    'waste-recycled': 0.2 // kg CO2 offset per kg recycled (will be made negative)
  };

  const categoryMap = {
    'Electricity': 'electricity',
    'Fuel': 'fuel',
    'Travel': 'travel',
    'Waste Recycled': 'waste-recycled'
  };

  const mappedCategory = categoryMap[category] || category.toLowerCase();
  const factor = factors[mappedCategory] || 0;

  if (valueNumeric && factor) {
    const co2Kg = valueNumeric * factor;
    const co2Tons = co2Kg / 1000; // Convert to tons
    
    // For waste recycling, return negative value (offset)
    if (mappedCategory === 'waste-recycled') {
      return -Math.abs(co2Tons); // Ensure negative value
    }
    
    return co2Tons;
  }

  return 0;
}

/**
 * Map category from frontend to database
 */
function mapCategoryToDb(category) {
  const categoryMap = {
    'Electricity': 'electricity',
    'Fuel': 'fuel',
    'Travel': 'travel',
    'Waste Recycled': 'waste-recycled'
  };
  return categoryMap[category] || 'other';
}

/**
 * Map category from database to frontend
 */
function mapCategoryToFrontend(category) {
  const categoryMap = {
    'electricity': 'Electricity',
    'fuel': 'Fuel',
    'travel': 'Travel',
    'waste-recycled': 'Waste Recycled',
    'energy': 'Electricity',
    'transportation': 'Travel',
    'waste': 'Waste Recycled',
    'manufacturing': 'Other',
    'other': 'Other'
  };
  return categoryMap[category] || 'Other';
}

/**
 * Format value for display
 */
function formatValue(category, valueNumeric) {
  const categoryMap = {
    'Electricity': 'kWh',
    'Fuel': 'liters',
    'Travel': 'km',
    'Waste Recycled': 'kg'
  };

  const unit = categoryMap[category] || '';
  if (category === 'Travel' && valueNumeric < 100) {
    return `${Math.round(valueNumeric)} flights`;
  }
  return `${valueNumeric.toLocaleString()} ${unit}`;
}

/**
 * GET /api/corporate/emissions
 * List all emissions with pagination and filtering
 */
exports.getEmissions = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { category, country, search, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (category && category !== 'all') {
      query.category = mapCategoryToDb(category);
    }
    if (country && country !== 'all') {
      query.country = country;
    }
    if (startDate || endDate) {
      query.periodDate = {};
      if (startDate) query.periodDate.$gte = new Date(startDate);
      if (endDate) query.periodDate.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { value: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [emissions, total] = await Promise.all([
      CorporateEmissions.find(query)
        .sort({ periodDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CorporateEmissions.countDocuments(query)
    ]);

    // Map emissions for frontend
    const mappedEmissions = emissions.map(emission => {
      const frontendCategory = mapCategoryToFrontend(emission.category);
      const co2Tons = emission.emissions || 0;
      const co2Output = co2Tons >= 0 
        ? `${co2Tons.toFixed(0)} tons`
        : `${Math.abs(co2Tons).toFixed(0)} tons`;

      return {
        id: String(emission._id),
        date: emission.periodDate.toISOString().split('T')[0],
        category: frontendCategory,
        value: emission.value || formatValue(frontendCategory, emission.valueNumeric || 0),
        co2Output: co2Output,
        country: emission.country || 'N/A'
      };
    });

    // Get statistics
    const allEmissions = await CorporateEmissions.find({
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEmissions = allEmissions.filter(e => 
      new Date(e.periodDate) >= thirtyDaysAgo
    );

    const totalEmissions = recentEmissions.reduce((sum, e) => {
      const co2 = e.emissions || 0;
      return sum + (co2 > 0 ? co2 : 0);
    }, 0);

    const wasteRecycled = recentEmissions
      .filter(e => e.category === 'waste-recycled' || e.category === 'waste')
      .reduce((sum, e) => sum + Math.abs(e.emissions || 0), 0);

    const totalEntries = allEmissions.length;

    res.json({
      success: true,
      data: {
        emissions: mappedEmissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          totalEmissions,
          wasteRecycled,
          totalEntries
        }
      }
    });
  } catch (error) {
    console.error('Error in getEmissions (corporate/emissions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load emissions',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/emissions
 * Create new emission entry
 */
exports.createEmission = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { electricity, fuel, travelDistance, travelFlights, wasteRecycled, country } = req.body;

    const entries = [];

    // Process electricity
    if (electricity && parseFloat(electricity) > 0) {
      const valueNum = parseFloat(electricity);
      const co2Tons = calculateCO2('Electricity', `${valueNum} kWh`, valueNum);
      entries.push({
        corporate: corporateId,
        period: 'monthly',
        periodDate: new Date(),
        category: 'electricity',
        emissions: co2Tons,
        unit: 'tons',
        value: `${valueNum.toLocaleString()} kWh`,
        valueNumeric: valueNum,
        country: country || '',
        description: `Electricity consumption: ${valueNum.toLocaleString()} kWh`
      });
    }

    // Process fuel
    if (fuel && parseFloat(fuel) > 0) {
      const valueNum = parseFloat(fuel);
      const co2Tons = calculateCO2('Fuel', `${valueNum} liters`, valueNum);
      entries.push({
        corporate: corporateId,
        period: 'monthly',
        periodDate: new Date(),
        category: 'fuel',
        emissions: co2Tons,
        unit: 'tons',
        value: `${valueNum.toLocaleString()} liters`,
        valueNumeric: valueNum,
        country: country || '',
        description: `Fuel consumption: ${valueNum.toLocaleString()} liters`
      });
    }

    // Process travel distance (km)
    if (travelDistance && parseFloat(travelDistance) > 0) {
      const valueNum = parseFloat(travelDistance);
      const co2Tons = calculateCO2('Travel', `${valueNum} km`, valueNum);
      entries.push({
        corporate: corporateId,
        period: 'monthly',
        periodDate: new Date(),
        category: 'travel',
        emissions: co2Tons,
        unit: 'tons',
        value: `${valueNum.toLocaleString()} km`,
        valueNumeric: valueNum,
        country: country || '',
        description: `Travel distance: ${valueNum.toLocaleString()} km`
      });
    }

    // Process travel flights
    if (travelFlights && parseFloat(travelFlights) > 0) {
      const flights = parseInt(travelFlights) || 1;
      // Average flight emits ~240 tons CO2 (long-haul average)
      const co2Tons = flights * 240;
      entries.push({
        corporate: corporateId,
        period: 'monthly',
        periodDate: new Date(),
        category: 'travel',
        emissions: co2Tons,
        unit: 'tons',
        value: `${flights} flight${flights > 1 ? 's' : ''}`,
        valueNumeric: flights,
        country: country || '',
        description: `Air travel: ${flights} flight${flights > 1 ? 's' : ''}`
      });
    }

    // Process waste recycled
    if (wasteRecycled && parseFloat(wasteRecycled) > 0) {
      const valueNum = parseFloat(wasteRecycled);
      const co2Tons = calculateCO2('Waste Recycled', `${valueNum} kg`, valueNum);
      // Ensure negative value for recycling offsets
      const emissionsValue = co2Tons < 0 ? co2Tons : -Math.abs(co2Tons);
      entries.push({
        corporate: corporateId,
        period: 'monthly',
        periodDate: new Date(),
        category: 'waste-recycled',
        emissions: emissionsValue, // Negative value for offsets
        unit: 'tons',
        value: `${valueNum.toLocaleString()} kg`,
        valueNumeric: valueNum,
        country: country || '',
        description: `Waste recycled: ${valueNum.toLocaleString()} kg`
      });
    }

    if (entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one emission value'
      });
    }

    const created = await CorporateEmissions.insertMany(entries);

    res.json({
      success: true,
      message: `${created.length} emission entr${created.length > 1 ? 'ies' : 'y'} created successfully`,
      data: {
        entries: created.map(e => ({
          id: String(e._id),
          date: e.periodDate.toISOString().split('T')[0],
          category: mapCategoryToFrontend(e.category),
          value: e.value,
          co2Output: `${e.emissions >= 0 ? '' : '-'}${Math.abs(e.emissions).toFixed(0)} tons`,
          country: e.country || 'N/A'
        }))
      }
    });
  } catch (error) {
    console.error('Error in createEmission (corporate/emissions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create emission entry',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/emissions/export
 * Export emissions as CSV
 */
exports.exportEmissions = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { category, country, startDate, endDate } = req.query;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (category && category !== 'all') {
      query.category = mapCategoryToDb(category);
    }
    if (country && country !== 'all') {
      query.country = country;
    }
    if (startDate || endDate) {
      query.periodDate = {};
      if (startDate) query.periodDate.$gte = new Date(startDate);
      if (endDate) query.periodDate.$lte = new Date(endDate);
    }

    const emissions = await CorporateEmissions.find(query)
      .sort({ periodDate: -1 })
      .lean();

    const csvRows = [
      ['Date', 'Category', 'Value', 'CO₂ Output (tons)', 'Country']
    ];

    emissions.forEach(emission => {
      const frontendCategory = mapCategoryToFrontend(emission.category);
      const co2Tons = emission.emissions || 0;
      const co2Output = co2Tons >= 0 
        ? co2Tons.toFixed(2)
        : `-${Math.abs(co2Tons).toFixed(2)}`;

      csvRows.push([
        new Date(emission.periodDate).toISOString().split('T')[0],
        frontendCategory,
        emission.value || '',
        co2Output,
        emission.country || 'N/A'
      ]);
    });

    const csv = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="emissions-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error in exportEmissions (corporate/emissions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export emissions',
      error: error.message
    });
  }
};

/**
 * DELETE /api/corporate/emissions/:id
 * Delete emission entry
 */
exports.deleteEmission = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const emission = await CorporateEmissions.findOneAndDelete({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    });

    if (!emission) {
      return res.status(404).json({
        success: false,
        message: 'Emission entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Emission entry deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteEmission (corporate/emissions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete emission entry',
      error: error.message
    });
  }
};
