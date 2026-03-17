export const trainingTips = [
  "Train to absolute failure on your last set for maximum hypertrophy.",
  "Rest is where the growth happens. Respect the timer!",
  "Going to failure is non-negotiable for intensity. Push through!",
  "Keep your form strict, even when you're pushing to failure.",
  "Concentrate on the muscle being worked. Mind-muscle connection matters.",
  "Failure means you couldn't do another rep with good form.",
  "Consistency + Intensity = Results. Don't skip the hard reps.",
  "Your central nervous system needs this rest. Don't skip it!",
  "Visualize the next set during your rest. Stay focused.",
  "If it doesn't challenge you, it doesn't change you. Go to failure."
];

export const getRandomTip = () => {
  return trainingTips[Math.floor(Math.random() * trainingTips.length)];
};
