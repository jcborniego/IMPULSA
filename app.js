let currentStep = 1;
const totalSteps = 3;

function nextStep(stepIndex) {
    // Determine the current step element
    const currentElem = document.getElementById(`step-${stepIndex}`);
    if(!currentElem) return;

    // Apply fade out animation
    currentElem.style.animation = 'fadeIn 0.3s ease reverse forwards';
    
    setTimeout(() => {
        currentElem.classList.remove('active');
        currentElem.style.animation = ''; // reset animation
        
        // Increment step
        currentStep++;
        
        // Update progress bar
        const progress = Math.min((currentStep / totalSteps) * 100, 100);
        document.getElementById('progress').style.width = `${progress}%`;
        
        // Show next element
        const nextElem = document.getElementById(`step-${currentStep}`);
        if(nextElem) {
            nextElem.classList.add('active');
        }

        // Specific logic if we reached the loading step (step 3)
        if (currentStep === 3) {
            setTimeout(() => {
                const loadingElem = document.getElementById('step-3');
                loadingElem.style.animation = 'fadeIn 0.3s ease reverse forwards';
                
                setTimeout(() => {
                    loadingElem.classList.remove('active');
                    loadingElem.style.animation = '';
                    document.getElementById('step-4').classList.add('active');
                }, 300);
                
            }, 2500); // 2.5 seconds delay to simulate AI processing
        }
    }, 300); // Wait for fadeOut
}
