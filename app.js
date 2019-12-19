class Flappy{
    constructor(canvas){
        //STATE
        this.state = 'inited';
        this.points = 0;
        this.currentColIndex = 0;
        // ELEMS
        this.canvas = canvas;
        this.output;
        this.bird;
        this.menu;
        this.button;
        this.currentCol;
        this.allColumns = [];
        // INTERVALS
        this.engineInterval;
        this.columnsInterval;
    }
    init(){
        Object.assign(this.canvas.style, {
            backgroundPositionX:'0px',
        })
        const bird = document.createElement('div');
        bird.id = 'bird';
        this.bird = bird;
        this.canvas.appendChild(bird);
        
        const output = document.createElement('p');
        output.id = 'output';
        output.innerHTML = 'Welcome!';
        canvas.appendChild(output);
        this.output = output;

        const menu = document.createElement('div');
        menu.id = 'menu';
        menu.className = 'active';
        const playButton = document.createElement('button');
        playButton.innerHTML = 'PLAY';
        menu.appendChild(playButton);
        this.button = playButton;
        this.menu = menu;
        canvas.appendChild(menu);
        
        window.addEventListener('keypress', (e)=>{this.controlsHandler(e)});
        this.canvas.addEventListener('click', (e)=>{this.controlsHandler(e)});
    }
    start(){
        this.state = 'playing';
        this.menu.className = '';
        const map = [150, 50, 150, 300, 200, 140, 300];
        function* colGenerator(array){
            let i = -1;
            while(true){
                i++;
                if(typeof array[i] === 'undefined'){
                    i = 0;
                }
                yield array[i];
            }
        }
        const gen = colGenerator(map);
        this.columnsInterval = setInterval(()=>{
            const current = gen.next().value;
            this.createColumn(current);
        }, 2500);
        this.engineInterval = setInterval(()=>{
            this.engine();
        }, 10);
        setTimeout(()=>{
            this.currentColIndex = 0;
            this.currentCol = this.allColumns[0];
        }, 2501);
    }
    end(){
        clearInterval(this.engineInterval);
        clearInterval(this.columnsInterval);
        this.output.innerHTML = 'GAME OVER!';
        this.button.innerHTML = 'REPLAY';
        this.menu.className = 'active';
        this.state = 'end';
    }
    replay(){
        this.menu.className = '';
        this.bird.style.top = 300+'px';
        this.points = 0;
        this.currentCol = null;
        this.currentColIndex = null;
        this.allColumns.forEach(col=>{
            col.remove();
        })
        this.allColumns = [];
        this.start();
    }
    controlsHandler(e){
        if(this.state === 'playing'){
            this.fly();
        }
        else if(this.state === 'inited' && e.target.tagName === 'BUTTON'){
            this.start();
        }
        else if(this.state === 'end' && e.target.tagName === 'BUTTON'){
            this.replay();
        }
    }
    fly(){
        if(this.bird.offsetTop > 50){
            this.bird.style.top = this.bird.offsetTop - 80 +'px';
        }
    }
    createColumn(gapTop){
        const column = document.createElement('div');
        column.className = 'column';
        const top = document.createElement('div');
        top.className = 'top';
        const bot = document.createElement('div');
        bot.className = 'bot';
        let topHeight = gapTop;
        let botHeight = this.canvas.offsetHeight - (topHeight + 200);
        topHeight += 'px';
        botHeight += 'px';
        Object.assign(column.style, {
            right:'-80px',
        })
        Object.assign(top.style, {
            height:topHeight,
        });
        Object.assign(bot.style, {
            height:botHeight,
        });
        column.appendChild(top);
        column.appendChild(bot);
        this.canvas.appendChild(column);
        this.allColumns.push(column);
    }
    engine(){
        if(this.bird.offsetTop < this.canvas.offsetHeight - 40){
            this.bird.style.top = this.bird.offsetTop + 2 +'px';
        }else{
            this.end();
        }
        const newBgPos = parseInt(this.canvas.style.backgroundPositionX.replace('px',''));
        this.canvas.style.backgroundPositionX = (newBgPos - 1) + 'px';
        this.allColumns.forEach(col=>{
            let right = parseInt(col.style.right.replace('px',''));
            right = right+1+'px';
            col.style.right = right;
        });
        if(this.points !== this.output.innerHTML){
            this.output.innerHTML = this.points;
        }
        if(typeof this.currentCol !== 'undefined' && this.currentCol !== null){
            this.collisionDetect();
        }
    }
    collisionDetect(){
        const bird = {
            top:this.bird.offsetTop,
            left:this.bird.offsetLeft,
            width:this.bird.offsetWidth,
            height:this.bird.offsetHeight,
        };
        const colTop = {
            top:this.currentCol.querySelector('.top').offsetTop,
            left:this.currentCol.offsetLeft,
            width:this.currentCol.querySelector('.top').offsetWidth,
            height:this.currentCol.querySelector('.top').offsetHeight,
        }
        const colBot = {
            top:this.currentCol.querySelector('.bot').offsetTop,
            left:this.currentCol.offsetLeft,
            width:this.currentCol.querySelector('.bot').offsetWidth,
            height:this.currentCol.querySelector('.bot').offsetHeight,
        }
        if(bird.left < colTop.left + colTop.width &&
            bird.left + bird.width > colTop.left &&
            bird.top < colTop.top + colTop.height &&
            bird.top + bird.height > colTop.top || bird.left < colBot.left + colBot.width &&
            bird.left + bird.width > colBot.left &&
            bird.top < colBot.top + colBot.height &&
            bird.top + bird.height > colBot.top){
            this.end();
        }
        if(bird.left>(colTop.left+colTop.width)){
            this.passed();
        }
    }
    passed(){
        this.currentColIndex = this.currentColIndex+1;
        this.currentCol = this.allColumns[this.currentColIndex];
        this.points = this.points+1;
    }
}

const canvas = document.querySelector('#canvas');
const game = new Flappy(canvas);
game.init();