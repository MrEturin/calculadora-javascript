class CalcController{

    constructor(){
        this._locale        = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._timeEl        = document.querySelector("#hora");
        this._dateEl        = document.querySelector("#data");
        this._setDisplayDateTime();
        this._initButtonEvents();
        this._operation = [];
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

    }

    _execBtn(value){
        switch(value){
            case "ac":
                this._clearAll();
                break;
            case "ce":
                this._clearEntry();
                break;
            case "soma":
                this._addOperation("+");
                break;
            case "subtracao":
                this._addOperation("-");
                break;
            case "divisao":
                this._addOperation("/");
                break;
            case "multiplicacao":
                this._addOperation("*");
                break;
            case "porcento":
                this._addOperation("%");
                break;
            case "igual":
                this._calc();
                break;
            case "ponto":
                this._addOperation(".");
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
                this._setError();
                break;
        }
    }

    _setError(){
        this.displayCalc = "Error";
    }

    _clearAll(){
        this._operation = [];
        this._setLastNumberToDisplay();
    }

    _clearEntry(){
        this._operation.pop();
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
                this._setLastOperation(parseInt(newValue));
                this._setLastNumberToDisplay();
            }

        }
    }
    
    _setLastNumberToDisplay(){
        let lastNumber = '';
        for(let i = this._operation.length-1; i>=0; i--){
            if(!this._isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }

        }

        console.log(lastNumber);
        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    _calc(){

        let last = '';

        if(this._operation.length > 3) last = this._operation.pop();

        let result = eval(this._operation.join(""));

        if(last == '%'){

            this._operation = [(result / 100)];

        }else{
            
            this._operation = [result];

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
        this._displayCalcEl.innerHTML = displayCalc;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(currentDate){
        this._currentDate = currentDate;
    }

}