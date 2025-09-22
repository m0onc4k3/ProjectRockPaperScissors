
document.addEventListener('DOMContentLoaded', function() {

    // Game state
    const state = {
        user: {
            score: 0,
            rounds: [null, null, null, null, null],
            currentRound: 0
        },
        oponent: {
            score: 0,
            rounds: [null, null, null, null, null],
            currentRound: 0
        },
        isGameOver: false,
        currentTurn: 'user',
        oponentState: 'waiting'

    };
    // Options
    const rockImg = document.getElementById('rock');
    const paperImg = document.getElementById('paper');
    const scissorsImg = document.getElementById('scissors');
    const cpuImg = document.getElementById('cpu');

    // Reset Button
    const resetBtn = document.getElementById('reset');
    
    // Message
    const messageEl = document.getElementById('message');

    // scoreboard containers
    const userEl = document.getElementById('user');
    const oponentEl = document.getElementById('oponent');

    // Initialize the UI
    updateUI();

    // Event listeners
    rockImg.addEventListener('click', function() {
        if (state.currentTurn === 'user' && !state.isGameOver) {
            selectOption('rock');
        }
    });
    paperImg.addEventListener('click', function() {
        if (state.currentTurn === 'user' && !state.isGameOver) {
            selectOption('paper');
        }
    });
    scissorsImg.addEventListener('click', function() {
        if (state.currentTurn === 'user' && !state.isGameOver) {
            selectOption('scissors');
        }
    });
    resetBtn.addEventListener('click', resetGame);

    // Functions
    async function resetImages() {
        // Return images to the waiting state
        // Delay 1 second to avoid user fast clicking on options
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(1000);

        // Reset user images
        imgArray = [rockImg, paperImg, scissorsImg,]
        if (state.currentTurn === 'oponent' && state.oponentState ==='thinking') {
            for (i=0;i<3;i++) {
                imgArray[i].src = imgArray[i].src.replace("selected", "wait");
            }     
        }

        // Reset cpu image
        cpuImg.src = cpuImg.src.replace(/[^\/]+(?=\.png$)/,"waitComputerThinking" );

        // Switch turns
        state.currentTurn = 'user';
        state.oponentState = 'waiting'
    }

    function changeUserImage(img) {
        // Change user images from waiting to selected state
        if (state.currentTurn === 'user' && state.oponentState ==='waiting') {
            img.src = img.src.replace("wait", "selected");
            state.currentTurn = 'oponent';
        }
    }

    function changeComputerImage(img, option) {
        // Change oponent image from waiting to selected state
        if (state.currentTurn === 'oponent' && state.oponentState ==='thinking') {
            img.src = img.src.replace("waitComputerThinking", `selected${option}`);
        }
    }

    function checkScore(answer1, answer2) {
        // Evaluate the round score from the user perspective
        const answers = {
            'rock': {'paper':false,'scissors':true},
            'paper': {'rock':true,'scissors':false},
            'scissors': {'rock':false,'paper':true},
        };
        return answers[answer1][answer2]
    }

    function selectOption(option) {
        // Events after an user has selected an image/option

        // Update selected image
        let img = document.getElementById(option);
        changeUserImage(img);
        
        // Make the oponent state to thinking
        state.oponentState = 'thinking';

        //Computer is thinking
        const optionsArray = ['Rock', 'Paper','Scissors']
        const computerSelection = optionsArray[Math.floor(Math.random() * 3)];
        changeComputerImage(cpuImg, computerSelection);
        
        // checkScore of the current round
        const isScored = checkScore(option, computerSelection.toLowerCase());
        
        // Update state
        const currentRound = state['user'].currentRound;
        state['user'].rounds[currentRound] = isScored;
        state['oponent'].rounds[currentRound] = isScored ? false : isScored === false ? true : undefined;

        if (isScored) {
            state['user'].score++;
        
        } else if (isScored===false) {
            state['oponent'].score++;

        } else {
            state['user'].score++;
            state['oponent'].score++;
        }
        
        // Move to next round
        state['user'].currentRound++;
        state['oponent'].currentRound++;

        // Check if game is over
        checkGameOver();
        
        // Update UI
        updateUI();
    }

    function checkGameOver() {
        // Chek if more than 5 rounds have been played
        const userDone = state.user.currentRound >= 5;
        const oponentDone = state.oponent.currentRound >= 5;
        
        if (userDone && oponentDone) {
            state.isGameOver = true;
            
            if (state.user.score > state.oponent.score) {
                messageEl.textContent = 'User Wins!';
            } else if (state.oponent.score > state.user.score) {
                messageEl.textContent = 'Computer Wins!';
            } else {
                messageEl.textContent = 'It\'s a Draw!';
            }
        }
    }

    function updateUI() {
        // Update UI

        // Update User circles
        for (let i = 0; i < 5; i++) {
            const circle = document.getElementById(`user-select-${i}`);
            circle.className = 'circle';
            
            if (state.user.rounds[i] === true) {
                circle.classList.add('won');
            } else if (state.user.rounds[i] === false) {
                circle.classList.add('lost');
            } else if (state.user.rounds[i] === undefined) {
                circle.classList.add('draw');
            }
        }
        
        // Update Oponent circles
        for (let i = 0; i < 5; i++) {
            const circle = document.getElementById(`oponent-select-${i}`);
            circle.className = 'circle';
            
            if (state.oponent.rounds[i] === true) {
                circle.classList.add('won');
            } else if (state.oponent.rounds[i] === false) {
                circle.classList.add('lost');
            } else if (state.oponent.rounds[i] === undefined) {
                circle.classList.add('draw');
            }
        }
        
        // Update scores
        document.getElementById('user-score').textContent = state.user.score;
        document.getElementById('oponent-score').textContent = state.oponent.score;

        // Reset Images
        resetImages();
    }

    function resetGame() {
        // Reset game to the initial state
        // Reset state
        state.user = {
            score: 0,
            rounds: [null, null, null, null, null],
            currentRound: 0
        };
        state.oponent = {
            score: 0,
            rounds: [null, null, null, null, null],
            currentRound: 0
        };
        state.isGameOver = false;
        state.currentTurn = 'user';
        state.oponentState = 'waiting'
        
        // Clear message
        messageEl.textContent = '';
        
        // Update UI
        updateUI();
    }

});