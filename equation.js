//equation 1
//green line
function t1(x) {
    return x / 360;
  }
  //distance as a function of time for eqn1
  function x1(t) {
    return 360 * t;
  }
  
  //equation 2
  //blue line
  function t2(x) {
    return sqrt(x * x + 40000) / 360;
  }
  //distance as a function of time for eqn2
  function x2(t) {
    if (t >= 0.555556) return sqrt(129600 * t * t - 40000);
    else return 0;
  }
  
  //equation 3
  //red line
  function t3(x) {
    return x / 660 + (5 * sqrt(85)) / 99;
  }
  //distance as a function of time for eqn3
  function x3(t) {
    if (t >= 0.4656) return 660 * t - (100 / 3) * sqrt(85);
    else return 0;
  }