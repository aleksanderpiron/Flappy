class Flappy{
    constructor(canvas){
        this.canvas = canvas;
        this.state = 'inited';
        this.points = 0;
        this.pointer;
        this.bird;
        this.columnsInterval;
        this.engineInterval;
        this.currentCol;
        this.currentColIndex = 0;
        this.columns = [];
    }
    init(){
        Object.assign(this.canvas.style, {
            width:'400px',
            height:'800px',
            background:'#3497ed',
            overflow:'hidden',
            position:'relative'
        });
        const bird = document.createElement('div');
        bird.id = 'bird';
        Object.assign(bird.style, {
            width:'40px',
            height:'40px',
            background:'#ffff00',
            position:'absolute',
            top:'100px',
            left:'80px'
        });
        this.bird = bird;
        this.canvas.appendChild(bird);
        const pointer = document.createElement('p');
        Object.assign(pointer.style, {
            position:'absolute',
            right:'0px',
            left:'0px',
            top:'20px',
            fontSize:'30px',
            color:'#fff',
            zIndex:'9',
            fontWeight:'700',
            textAlign:'center',
            margin:'auto'
        });
        canvas.appendChild(pointer);
        this.pointer = pointer;
        window.addEventListener('keypress', ()=>{this.controlsHandler()});
        this.canvas.addEventListener('click', ()=>{this.controlsHandler()});
    }
    start(){
        this.state = 'playing';
        const map = [350, 250, 350, 100, 200];
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
            this.currentCol = this.columns[0];
        }, 2501);
    }
    end(){
        clearInterval(this.engineInterval);
        clearInterval(this.columnsInterval);
        this.pointer.innerHTML = 'GAME OVER!';
        this.state = 'end';
    }
    controlsHandler(){
        if(this.state === 'playing'){
            this.fly();
        }
        else if(this.state === 'inited'){
            this.start();
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
            width:'80px',
            height:'100%',
            position:'absolute',
            right:'-80px',
            top:'0px',
        })
        Object.assign(top.style, {
            width:'80px',
            height:topHeight,
            background:'#52d138',
            position:'absolute',
            top:'0px',
            left:'0px'
        });
        Object.assign(bot.style, {
            width:'80px',
            height:botHeight,
            background:'#52d138',
            position:'absolute',
            bottom:'0px',
            left:'0px'
        });
        column.appendChild(top);
        column.appendChild(bot);
        this.canvas.appendChild(column);
        this.columns.push(column);
    }
    engine(){
        if(this.bird.offsetTop < this.canvas.offsetHeight - 40){
            this.bird.style.top = this.bird.offsetTop + 2 +'px';
        }else{
            this.end();
        }
        this.columns.forEach(col=>{
            let right = parseInt(col.style.right.replace('px',''));
            right = right+1+'px';
            col.style.right = right;
        });
        if(this.points !== this.pointer.innerHTML){
            this.pointer.innerHTML = this.points;
        }
        if(typeof this.currentCol !== 'undefined'){
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
        this.currentCol = this.columns[this.currentColIndex];
        this.points = this.points+1;
    }
}

const canvas = document.querySelector('#canvas');
const game = new Flappy(canvas);
game.init();