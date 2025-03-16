export function processDateString(dateString: any): {
  $gte: string;
  $lte: string;
} {
  return {
    $gte: dateString.concat('T00:00:00.000Z'),
    $lte: dateString.concat('T23:59:59.999Z'),
  };
}
