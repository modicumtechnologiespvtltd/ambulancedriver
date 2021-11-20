import English from './English';
import Kannada from './Kannada';
import React, {useState, useEffect} from 'react';

const SetLang = () => {
  const [checkLang, setCheckLang] = useState();
  if (checkLang == 'Kannada') {
    setCheckLang('Kannada');
  } else {
    setCheckLang('English');
  }
  return checkLang;
};

// function SetLang() {
//   var checkLang;
//   if (checkLang == 'Kannada') {
//     checkLang = 'Kannada';
//   } else {
//     checkLang = 'English';
//   }
//   return checkLang;
// }

export default SetLang;
