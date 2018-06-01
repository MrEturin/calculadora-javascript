class CalcController{

    constructor(){
        this._audio = new Audio('click.mp3');
        this._lastOperator = '';
        this._lastNumber = '';
        this._locale        = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._timeEl        = document.querySelector("#hora");
        this._dateEl        = document.querySelector("#data");
        this._operation = [];
        this._audioStatus= false;
    }

    initialize(){
        /*
        assim podemos pegar o id gerado para a função interval caso seja necessário para-lá
        let interval = setInterval(()=>{
        setTimeout(() =>{
            clearInterval(interval);
        }, 10000);
        */
        setInterval(()=>{
            this._setDisplayDateTime()
        }, 1000);

        this._setDisplayDateTime();
        this._initButtonEvents();

        this._initKeyboard();
        this._pasteFromClipBoard();

        this._addSoundToCLick();

    }

    _touggleAudio(){
        console.log("Entrei aqui");
        this._audioStatus = !this._audioStatus;
    }

    _addSoundToCLick(){
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this._touggleAudio();
            }
        )}, false);
    }

    _playAudio(){

        if(this._audioStatus){
            this._audio.currentTime = '0';
            this._audio.play();
        }

    }

    _pasteFromClipBoard(){

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData("Text");
            this._operation = [parseFloat(text)];
            this._setLastNumberToDisplay();


        }

    )};

    _initKeyboard(){
        document.addEventListener('keyup', e=>{
            if(e.key == 'c' && e.ctrlKey){
                 this._copyToClipBord();
            }else{
                this._execBtn(e.key);
            }
        });
    }

    _copyToClipBord(){

        let input = document.createElement("input");
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
    }

    _execBtn(value){
        let validBtn = true;
        switch(value){
            case "Escape":
            case "ac":
                this._clearAll();
                break;
            case "Backspace":
            case "ce":
                this._clearEntry();
                break;
                case "+":
            case "soma":
                this._addOperation("+");
                break;
            case "-":
            case "subtracao":
                this._addOperation("-");
                break;
                case "/":
            case "divisao":
                this._addOperation("/");
                break;
                case "*":
            case "multiplicacao":
                this._addOperation("*");
                break;
            case "%":
            case "porcento":
                this._addOperation("%");
                break;
            case "Enter":
            case "=":
            case "igual":
                this._calc();
                break;
            case ".":
            case ",":
            case "ponto":
                this._addDot();
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this._addOperation(parseInt(value));
                break;
            default:
                validBtn = false;
                break;
        }
        if(validBtn) this._playAudio();
    }

    _setError(){

        this.displayCalc = "Error";
        setTimeout(()=> this._clearAll(), 1000 );

    }

    _clearAll(){
        this._operation     = [];
        this._lastNumber    = '';
        this._lastOperator  = '';
        this._setLastNumberToDisplay();
    }

    _clearEntry(){
        this._operation.pop();
        this._setLastNumberToDisplay();
    }

    _addDot(){

        let lastOperation = this._getLastOperation();
        
        if(typeof lastOperation === 'string' && lastOperation.split("").indexOf(".") > -1) return;

        if(this._isOperator(lastOperation) || !lastOperation){
            this._pushOperation("0.");
        }else{
            this._setLastOperation(lastOperation.toString() + ".");
        }

        this._setLastNumberToDisplay();

    }

    _getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    _setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    _isOperator(value){
        return (['+', '-', '*', '/', '%'].includes(value));
    }

    _pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this._calc();
        }
    }

    _addOperation(value){

        if(isNaN(this._getLastOperation())){

            if(this._isOperator(value)){

                this._setLastOperation(value);

            }else{

                this._pushOperation(value);
                this._setLastNumberToDisplay();

            }
        }else{
            if(this._isOperator(value)){
                if(value == '%' && this._operation.length < 2){
                    this._operation = ['0.'+this._operation[0]];
                    this._setLastNumberToDisplay();
                }else{
                    this._pushOperation(value);
                }
            }else{
                let newValue = this._getLastOperation().toString() + value.toString();
                this._setLastOperation(newValue);
                this._setLastNumberToDisplay();
            }

        }
    }

    _getLastItem(isOperator = true){

        let lastItem = '';
        for(let i = this._operation.length-1; i>=0; i--){
            if(this._isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }
    
    _setLastNumberToDisplay(){

        let lastNumber = this._getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    _convertResults(){
        this._operation[0] = parseFloat(this._operation[0]);
        if(this._operation[2] != 'undefined')
            this._operation[2] = parseFloat(this._operation[2]);
    }
    _getResult(){
        this._convertResults();
        return eval(this._operation.join(""));
    }

    _calc(){

        let last = '';
        this._lastOperator  = this._getLastItem();

        if(this._operation.length < 3){

            let firstItem   = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){

            last                = this._operation.pop();
            this._lastNumber    = this._getLastItem(false);

        }else if(this._operation.length == 3){

            this._lastNumber    = this._getLastItem(false);

        }

        if(last == '%'){

            this._operation[2] = this._operation[0] / 100 * this._operation[2];
            

            console.log(this._operation);
            /*
            1 + 1%
            1 - 1%
            1 * 1%
            1 / 1%
            */

            this._operation = [this._getResult()];

        }else{

            this._operation = [this._getResult()];

            if(last) this._operation.push(last);
        
        }

        this._setLastNumberToDisplay();
    }

    _initButtonEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index) => {
            
            this._addEventListenerAll(btn, ["click", "drag"], func =>{
                let texto = btn.className.baseVal.replace("btn-", "");
                this._execBtn(texto);
            });
            
            this._addEventListenerAll(btn, ["mouseover", "mouseup", "mousedown"], func =>{
                btn.style.cursor = "pointer";
            });
        });

    }

    _addEventListenerAll(element, events, func){
        events.forEach(el =>{
            element.addEventListener(el, func, false);
        });

    }

    _setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(date){
        this._dateEl.innerHTML = date;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(time){
        this._timeEl.innerHTML = time;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(displayCalc){
        if(displayCalc.toString().length > 10){
            this._setError();
        }else{
            this._displayCalcEl.innerHTML = displayCalc;
        }
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(currentDate){
        this._currentDate = currentDate;
    }

}