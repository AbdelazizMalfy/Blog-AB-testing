let interactions = JSON.parse(localStorage.getItem('interactions')) || [];

export const trackPageview = (params) => {
  const {userId, variation} = params
  interactions.push({userId, action: 'pageview', variation});
  localStorage.setItem('interactions', JSON.stringify(interactions));
};

export const trackEvent = (params) => {
  const {userId, variation} = params
  interactions.push({userId, action: 'signup', variation});
  localStorage.setItem('interactions', JSON.stringify(interactions));
};


export const calculateCTR = () => {
  const uniqueViews = { control: new Set(), test: new Set() };
  const uniqueSignUps = { control: new Set(), test: new Set() };

  interactions.forEach(({ userId, action, variation }) => {

    if (!uniqueViews[variation]) {
      return
    }
    if (!uniqueSignUps[variation]) {
      return
    }

    if (action === 'pageview') {
      uniqueViews[variation].add(userId);
    } else if (action === 'signup') {
      uniqueSignUps[variation].add(userId);
    }
  });

  const ctrResults = {};

  // Calculate CTR for each variation
  Object.keys(uniqueViews).forEach(variation => {
    const views = uniqueViews[variation].size;
    const signUps = uniqueSignUps[variation].size;
    const ctr = views > 0 ? (signUps / views) * 100 : 0;
    ctrResults[variation] = `${ctr.toFixed(2)}%`;
  });

  return ctrResults;
};
