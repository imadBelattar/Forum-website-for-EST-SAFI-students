//formating the question measurements
function formatMeasurement(measurements) {
    if(measurements === undefined) return "0"
  if (measurements >= 1000000) {
    return (measurements / 1000000).toFixed(1) + "M";
  } else if (measurements >= 1000) {
    return (measurements / 1000).toFixed(1) + "K";
  } else {
    return measurements.toString();
  }
}
module.exports = { formatMeasurement };
