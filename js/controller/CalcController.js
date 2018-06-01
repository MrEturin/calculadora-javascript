class CalcController{

    constructor(){
        this._lastOperator = '';
        this._lastNumber = '';
        this._locale        = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._timeEl        = document.querySelector("#hora");
        this._dateEl        = document.querySelector("#data");
        this._setDisplayDateTime();
        this._initButtonEvents();
        this._operation = [];
        this._initialize();
        this._initKeyboard();
    }

    _initialize(){
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

    }

    _initKeyboard(){
        document.addEventListener('keyup', e=>{
            console.log(e.key);
            this._execBtn(e.key);
        });
    }

    _copyToClipBord(){
        let input = document.createElement("input");
        input.value = this._displayCalc();
    }

    _execBtn(value){
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
                return;
                break;
        }
    }

    _setError(){
        this._displayCalc = "Error";
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

            }else if(isNaN(value)){

                console.log("Porcentagem e .");

            }else{

                this._pushOperation(value);
                this._setLastNumberToDisplay();

            }
        }else{
            if(this._isOperator(value)){
                this._pushOperation(value);
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

        this._displayCalc = lastNumber;

    }

    _getResult(){
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
        this._displayDate = this._currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this._displayTime = this._currentDate.toLocaleTimeString(this._locale);
    }

    get _displayDate(){
        return this._dateEl.innerHTML;
    }

    set _displayDate(date){
        this._dateEl.innerHTML = date;
    }

    get _displayTime(){
        return this._timeEl.innerHTML;
    }

    set _displayTime(time){
        this._timeEl.innerHTML = time;
    }

    get _displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set _displayCalc(displayCalc){
        this._displayCalcEl.innerHTML = displayCalc;
    }

    get _currentDate(){
        return new Date();
    }

    set _currentDate(currentDate){
        this._currentDate = currentDate;
    }

}