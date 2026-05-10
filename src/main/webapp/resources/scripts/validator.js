class Result {
    constructor(isValid, number, msg) {
        this.number = number;
        this.isValid = isValid;
        this.msg = msg;
    }
}

function get(parent, element, left, right, errorMsg){
    try{
        const form = document.getElementsByClassName(parent)[0];
        let values = Array.from(form.querySelectorAll(element)).map(elem => elem.value.replace(",", "."));

        for (const elem of values) {
            if (!check(elem, left, right)) return new Result(false, null, errorMsg);
        }

        if (values.length !== 0) return new Result(true, values, "ok");
        else return new Result(false, null, "values can't be empty");
    } catch (err) {
        return new Result(false, null, "values can't be empty");
    }
}


function check(num, left, right) {
    if (num === undefined) return false;
    let val = parseFloat(num);
    if (isNaN(val) || !isFinite(val)) return false;
    if (val < left || val > right) return false;
    return true;
}

function validate() {
    let xH = get("mainCl", "#hiddenX", -5, 1, "X must be between -5 and 1");
    let yH = get("mainCl", "#hiddenY", -3, 5, "Y must be between -3 and 5");
    let rH = get("mainCl", "#rInput", 1, 4, "R must be between 1 and 4");

    if (!(xH.isValid && yH.isValid && rH.isValid)) {
        let errors = "Errors:";
        if (!xH.isValid) errors += "\n • " + xH.msg;
        if (!yH.isValid) errors += "\n • " + yH.msg;
        if (!rH.isValid) errors += "\n • " + rH.msg;
        showError(errors);
        return false;
    }
    return true;
}

function checkR() {
    let rH = get("mainCl", "#rInput", 1, 4, "R must be between 1 and 4");
    return rH.isValid;


}





