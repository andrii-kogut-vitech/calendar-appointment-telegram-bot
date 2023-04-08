require('dotenv').config();
const axios = require('axios');

const getTradingHistory = async (exchangePair, timeGranularity, timeFrame) => {
    const apiKey = process.env.BINANCE_API_KEY;

    // Validate and convert time granularity to milliseconds
    const timeGranularityMapping = {
        '1m': 60000,
        '3m': 180000,
        '5m': 300000,
        '15m': 900000,
        '30m': 1800000,
        '1h': 3600000,
        '2h': 7200000,
        '4h': 14400000,
        '6h': 21600000,
        '12h': 43200000,
        '1d': 86400000,
        '3d': 259200000,
        '1w': 604800000,
        '1M': 2592000000,
    };

    if (!timeGranularityMapping.hasOwnProperty(timeGranularity)) {
        throw new Error('Invalid time granularity');
    }

    const endTime = new Date().getTime();
    const startTime = endTime - timeGranularityMapping[timeGranularity] * timeFrame;

    const url = `https://api.binance.com/api/v3/klines?symbol=${exchangePair}&interval=${timeGranularity}&startTime=${startTime}&endTime=${endTime}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        });

        const data = response.data.map(item => {
            return {
                openTime: item[0],
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                volume: item[5],
                closeTime: item[6],
            };
        });

        return data;
    } catch (error) {
        console.error('Error fetching trading history:', error.message);
    }
};

module.exports = getTradingHistory;
