export function processDateString(dateString: any): {
  $gte: string;
  $lt: string;
} {
  return {
    $gte: dateString.concat('T00:00:00.000Z'),
    $lt: dateString.concat('T23:59:59.999Z'),
  };
}
