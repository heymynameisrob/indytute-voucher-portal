export const titleCase = (string) => {
  var sentence = string.toLowerCase().split(" ");
  for(var i = 0; i< sentence.length; i++){
     sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }  
  return sentence;
}

export const truncateString = (str) => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= 40) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, 40) + '...'
}