import { trackPageview, trackEvent, calculateCTR } from "./analytics-api.js";

function getUserId() {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    const userIds = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];
    userId = userIds[Math.floor(Math.random() * userIds.length)];
    localStorage.setItem('userId', userId);
  }

  return userId;
}

async function applyActiveTestConfig() {
  try {
  const response = await fetch('../config.json');

  if (!response.ok) {
    throw new Error(`error occuried! status: ${response.status}`);
  }
  const config = await response.json();

  const activeTest = config.tests[config.activeTest];

  let variation = localStorage.getItem('blogVariation');

  if (!variation) {
    const randomIndex = Math.floor(Math.random() * activeTest.variations.length);
    variation = activeTest.variations[randomIndex];

    localStorage.setItem('blogVariation', variation);
  }

  displayContent(variation);

  } catch (error) {
    console.error('Failed to apply active test configuration:', error);
  }
}

const displayContent = (variation) => {
  const controlContent = document.getElementById('control');
  const testContent = document.getElementById('test');

    
  if (variation === 'control') {
    controlContent.style.display = 'block';
  } else {
    testContent.style.display = 'block';
  }
}

applyActiveTestConfig().then(() => {
  const variation = localStorage.getItem('blogVariation');

  trackPageview({
    userId: getUserId(),
    variation: variation
  });

  if (document.getElementById(`${variation}SignUpButton`)) {
    document.getElementById(`${variation}SignUpButton`).addEventListener('click', () => {
      trackEvent({
        userId: getUserId(),
        variation: variation
      });
      
    });
  }
  
  console.log(calculateCTR())
})
