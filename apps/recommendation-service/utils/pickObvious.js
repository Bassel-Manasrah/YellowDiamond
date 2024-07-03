export default function pickObvious(list) {
  if (list.length <= 1) return list;

  const picks = [list[0]];
  for (let i = 1; i < list.length; i++) {
    if (isGreatlyMorePopular(list[i - 1], list[i])) {
      break;
    }
    picks.push(list[i]);
  }

  return picks;
}

function isGreatlyMorePopular(item1, item2) {
  return (
    item1.popularity - item2.popularity >= 20 ||
    item1.popularity > 3 * item2.popularity
  );
}
