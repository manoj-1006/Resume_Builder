export const toggleBoldInInput = (currentText = '', selStart, selEnd) => {
  if (selStart !== undefined && selEnd !== undefined && selStart !== selEnd) {
    const selected = currentText.substring(selStart, selEnd);
    if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
      const unwrapped = selected.slice(2, -2);
      const newText = currentText.substring(0, selStart) + unwrapped + currentText.substring(selEnd);
      return { newText, newStart: selStart, newEnd: selStart + unwrapped.length };
    } else {
      const wrapped = `**${selected}**`;
      const newText = currentText.substring(0, selStart) + wrapped + currentText.substring(selEnd);
      return { newText, newStart: selStart, newEnd: selStart + wrapped.length };
    }
  } else {
    const placeholder = '**bold text**';
    const pos = selStart !== undefined ? selStart : currentText.length;
    const newText = currentText.substring(0, pos) + placeholder + currentText.substring(pos);
    return { newText, newStart: pos + 2, newEnd: pos + 11 };
  }
};
