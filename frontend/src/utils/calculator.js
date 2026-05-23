export const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

export const SYSTEM_COST_PER_KW = 70000;

export const getSubsidy = (kw) => {
  if (kw <= 1) return 30000;
  if (kw <= 2) return 60000;
  return 78000;
};

export const calcSolarSavings = (capacityKw, monthlyBill) => {
  const totalCost = capacityKw * SYSTEM_COST_PER_KW;
  const subsidy = getSubsidy(capacityKw);
  const netCost = Math.max(0, totalCost - subsidy);
  const monthlySavings = Math.min(monthlyBill * 0.8, capacityKw * 120);
  const annualSavings = monthlySavings * 12;
  const payback = annualSavings > 0 ? netCost / annualSavings : 0;
  const lifetime = annualSavings * 25 - netCost;

  return { totalCost, subsidy, netCost, monthlySavings, annualSavings, payback, lifetime };
};

export const checkEligibilityResult = (propType, state, bill) => {
  if (!propType || !state || bill < 500) {
    return {
      type: 'warn',
      title: '⚠ Please fill all fields for an accurate check.',
      detail: 'Enter your property type, state, and monthly bill.',
    };
  }

  if (propType !== 'residential') {
    const savings = Math.round(bill * 0.75);
    return {
      type: 'success',
      title: '✅ Eligible for Commercial Solar Benefits!',
      detail: `As a ${propType} customer, you qualify for accelerated 40% depreciation and net metering. Estimated savings: ₹${savings.toLocaleString('en-IN')}/month. Our commercial team will prepare a custom proposal.`,
    };
  }

  const recKw = bill < 2000 ? 2 : bill < 5000 ? 3 : 5;
  const sub = recKw >= 3 ? 78000 : recKw === 2 ? 60000 : 30000;
  const stateBonus = ['gujarat', 'maharashtra', 'up'].includes(state)
    ? ' Plus, you qualify for additional state top-up subsidy!'
    : '';
  const savings = Math.round(bill * 0.72);
  const paybackYr = (recKw * 70000 - sub) / (savings * 12);
  const paybackStr = paybackYr < 1 ? '< 1 year' : `${Math.round(paybackYr * 10) / 10} years`;

  return {
    type: 'success',
    title: `✅ You are eligible for ₹${sub.toLocaleString('en-IN')} central subsidy!`,
    detail: `We recommend a ${recKw} kW system for your usage. Estimated monthly savings: ₹${savings.toLocaleString('en-IN')}. Payback period: ~${paybackStr}.${stateBonus}`,
  };
};
