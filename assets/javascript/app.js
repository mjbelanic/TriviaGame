// Things to do:
// find and highlight answer green if wrong
// else highlight green
// Make reveal WAIT 10 secs before moving on to next question
// ensure user can't press divs while review is going



$(document).ready(function(){

	$("#totalScorePanel").attr("style" , "display:none");
	$("#gamePanel").attr("style", "display:none");

	var Question = function( category ,questionTxt , RAnswer , WAnswer1 , WAnswer2 , WAnswer3, info, image){
		this.cat = category;
		this.Txt = questionTxt;
		this.RAns = RAnswer;
		this.WAns1 = WAnswer1;
		this.WAns2 = WAnswer2;
		this.WAns3 = WAnswer3;
		this.explain = info;
		this.img = image;
	}

	var q1 = new Question("Why the name got X'ed " , "What does the X in Xbox refer to?" ,
							 "DirectX" , "Extreme", "Cross-Platform" , "Nothing" , 
							 "DirectX is a graphics API used by Microsoft and was put into their console, hence DirectX Box",
							 "assets/images/Directx9.png");

	var q2 = new Question("Consoles of Biblical Proportion", "The Sega Genesis shares a name with the first book in the Bible. " +
							"What would there name be if they shared it with the LAST book of the Bible?" , "The Sega Revelations" ,  
							"The Sega Kings" , "The Sega Proverbs" , "The Sega Numbers", "Revelations is the last book in the Bible, " + 
							"therefore Sega would have called their console the Sega Revelations", "assets/images/segaGen.jpg");
 
	var q3 = new Question("The 6th Generation", "Which of these systems was not a console from the Sixth Generation of Gaming Consoles?", 
									"Microsoft XBox360" , "Sega Dreamcast" , "Sony PlayStation 2" , "Nintendo GameCube" ,
									"The Xbox360 was a part of the Seventh Generation of Consoles. The Xbox was a part of the  Sixth " +
									"along with the Dreamcast, PlayStation 2, and GameCube." , "assets/images/xbox.jpg");

	var q4 = new Question("Running Circles with the Xbox360", "If the Xbox360 described its size, what would its name be if it was half its size? ",
						 "XBox180" , "XBox250" , "XBox360" , "XBox720", "Half of 360 is 180, therefore the Xbox360 would be called the Xbox180.", 
						 "assets/images/360.png");

	var q5 = new Question("Controlling the NES" , "How many buttons did the NES game controller have? D-Pad counts as 1.",
							"5", "6", "4" ,"8" , "Along with the D-Pad, the NES controller had a start, select, A, and B button.",
							"assets/images/nesController.jpg");

	var q6 = new Question("Game and Watch This Question", "Which of these was not a Game and Watch Game?",
							 "Watchman","Manhole", "Chef","Helmet", "Watchman was not a game on the Game and Watch handheld system.",
							 "assets/images/Game_&_Watch.png");

	var q7 = new Question("Colors of PlayStation", "Which of these PlayStation consoles was not originally black?",
							"PlayStation 1" , "PlayStation 4" , "PlayStation 2" , "PlayStation 3", "The PlayStation 1 was originally gray.",
							"assets/images/playstation.jpg");

	var q8 = new Question("Java Scripting an Out of Place Question", "Programmers often need to loop through problems, but "+
							"which of these is NOT a loop?", "if","do while","for","while" , "The if statement is not a loop " +
							"but rather a conditional statement to check if something is true.", "assets/images/if-else.jpg");
	
	var q9 = new Question("Nintendon't You Know This?", "What does the 64 in Nintendo64 refer to?", 
							"Its 64 bit central processing unit." , "The 64 colors it could display." , 
							"The 64 games it launched with.", "The year it came out: 1964.", 
							"The 64 in Nintendo64 refers to the system's central processing unit or CPU.",
							"assets/images/n64.jpg");
	
	var q10 = new Question("Sega Goes to Space" , "In 1994, Sega released the Sega Saturn, but what would it have been called " +
							"if the console was named after the largest moon of Saturn?" , 
							"The Sega Titan" , "The Sega Pandora" , "The Sega Hyperion" , "The Sega Atlas" , 
							"The largest moon of Saturn is named Titan, therefore it would be called the Sega Titan.",
							"assets/images/titan.jpg");
	
		
	var right;
	var wrong1;
	var wrong2;
	var wrong3;
	var questionArray = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];

	var Timer = {
		  clockRunning: false,
	  	  intervalId: null,
		  time: null,

		  reset: function(givenTime) {
		    // DONE: Change the "display" div to "00:00."
		    this.time = givenTime;
		    $("#timer").html(this.time);
		  },

		  start: function(givenTime) {
		  	this.time = givenTime;
		    // DONE: Use setInterval to start the count here and set the clock to running.
		    if (!this.clockRunning) {
		        this.intervalId = setInterval(Timer.decrement, 1000);
		        this.clockRunning = true;
		    }
		  },

		  stop: function() {
		    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
		    clearInterval(this.intervalId);
		    this.clockRunning = false;
		  },

		  // function
		  // setTimeout(timeUp, 30000);

		  decrement: function() {
		    // DONE: increment time by 1, remember we cant use "this" here.
		    if(Timer.time > 0){
			    Timer.time--;
			    var converted = Timer.timeConverter(Timer.time);
			    $("#timer").html(converted);
			}else{
				Timer.stop();
				TriviaGame.notAnswered += 1;
				TriviaGame.RevealAns(null);
				TriviaGame.CheckQuestionList(TriviaGame.questions);
			}
		  },

		  timeConverter: function(t) {
			    if (t < 10) {
			      t = "0" + t;
			    }
			    return t;
			},
	}


	var TriviaGame = {
			score: 0,
			correctCount: 0,
			incorrectCount: 0,
			notAnswered: 0,
			questions: [],
			numberArray: [1,2,3,4],
			choosenQuestion: null,

		PlayGame: function(array){
			$("#play").attr("style", "display:none")
			$("#playAgain").attr("style","display:none")
			$("#totalScorePanel").attr("style" , "display:none");
			$("#gamePanel").attr("style", "display:block");
			this.score = 0;
			this.correctCount = 0;
			this.incorrectCount = 0;
			this.notAnswered = 0;
			TriviaGame.questions = array;
			this.PickRandomQuestion(TriviaGame.questions);
		},


		ShuffleArray: function(array){
			var copy = [];
			var len = array.length;
			var i;
			while(len){
				i = Math.floor(Math.random() * array.length);

				if(i in array){
					copy.push(array[i]);
					delete array[i];
					len--;
				}
			}
			return copy
		},

		PickRandomQuestion: function(array){
			TriviaGame.choosenQuestion = array[Math.floor(Math.random() * array.length)];
			TriviaGame.questions.splice(array.indexOf(TriviaGame.choosenQuestion), 1);
			Timer.reset(30);
			var questionCat = TriviaGame.choosenQuestion.cat;
			var questionText = TriviaGame.choosenQuestion.Txt;
			right = TriviaGame.choosenQuestion.RAns;
			wrong1 = TriviaGame.choosenQuestion.WAns1;
			wrong2 = TriviaGame.choosenQuestion.WAns2;
			wrong3 = TriviaGame.choosenQuestion.WAns3;
			$("#gamePanel .panel-title").html(questionCat);
			$("#question").html(questionText);
			$("#image").attr("style" , "display:none");
			$("#image").attr("src", TriviaGame.choosenQuestion.img);
			//for loop 1 to 4, giving a random number to each
			this.numberArray = TriviaGame.ShuffleArray(this.numberArray);
			$("#" + TriviaGame.numberArray[0]).html(right);
			$("#" + TriviaGame.numberArray[1]).html(wrong1);
			$("#" + TriviaGame.numberArray[2]).html(wrong2);
			$("#" + TriviaGame.numberArray[3]).html(wrong3);
			Timer.start(30);
		},

		CheckQuestionList: function(array){
			if(array.length >= 1){
					Timer.reset(30);
					this.PickRandomQuestion(array);
				}else{
					this.GoToScore(this.correctCount, this.incorrectCount, this.notAnswered, this.score);
				}
		},

		GoToScore: function(rightAns, wrongAns, noAns, score){
			$("#gamePanel").attr("style", "display: none");
			$("#scorePanel").empty();
			var array = [rightAns, wrongAns, noAns, score];
			
			//Makes score board
			for(i = 0; i < array.length; i++){
				var arrayCat = ["Right Answers", "Wrong Answers" , "Not Answered" , "Time Score"];
				var divName = $("<div>");
				divName.addClass("col-sm-3");
				divName.attr("style", "border: 1px solid red");
				divName.attr("style", "text-align: center");
				var cat = $("<h3>");
				cat.html(arrayCat[i]);
				divName.append(cat);
				var count = $("<h5>");
				count.html(array[i]);
				divName.append(count);
				$("#scorePanel").append(divName);
			}
			$("#totalScorePanel").attr("style" , "display: block");
			$("#playAgain").attr("style","display:block")
		},

		RevealAns:function(choice){
			if(choice !== TriviaGame.choosenQuestion.Rans && choice !== null){
				Timer.start(10);
				$("#question").html(TriviaGame.choosenQuestion.explain);
				$("#image").attr("style","display: block");
				choice.attr("display", "background-color: red");
			}
		},

	};

	$(".ans").on("click", function(){
		var choiceElement = $(this).children("h3");
		var choice = $(this).children("h3").html();
		if(choice === right){
			TriviaGame.correctCount += 1;
			TriviaGame.score += Timer.time;
			TriviaGame.RevealAns(choiceElement);
			TriviaGame.CheckQuestionList(TriviaGame.questions)
		}else{
			TriviaGame.incorrectCount += 1;
			TriviaGame.score -= Timer.time;
			TriviaGame.RevealAns(choiceElement);
			TriviaGame.CheckQuestionList(TriviaGame.questions);
		}
	})

	$("#playAgain").on("click", function(){
		questionArray = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
		TriviaGame.PlayGame(questionArray);
	});

	$("#play").on("click", function(){
		questionArray = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
		TriviaGame.PlayGame(questionArray);
	});

});