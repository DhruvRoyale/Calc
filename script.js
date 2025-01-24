function get_data() {
    am = parseFloat(document.querySelector('#am').value)
    n = parseFloat(document.querySelector('#n').value)
    r = parseFloat(document.querySelector('#r').value)
    m = parseFloat(document.querySelector('#m').value)

    r = r/100

    return {"am": am, "n": n, "r": r, "m": m}
}

function PV() {
    let data = get_data()

    let pvif = (1/((1 + (data["r"] / data["m"])) ** (data["m"] * data["n"])))

    document.querySelector('#answer').innerHTML = "Present Value = " + result(pvif, false)
}

function FV() {
    let data = get_data()

    let fvif = ((1 + (data["r"] / data["m"])) ** (data["m"] * data["n"]))

    document.querySelector('#answer').innerHTML = "Future Value = " + result(fvif, false)
}

function PVA() {
    let data = get_data()

    let pvifa = ((1 - (1 / (1 + (data["r"] / data["m"])) ** (data["m"] * data["n"]))) / (data["r"] / data["m"]))

    document.querySelector('#answer').innerHTML = "Present Value of the Annuity = " + result(pvifa, true)
}

function FVA() {
    let data = get_data()

    let fvifa = (((1 + (data["r"] / data["m"])) ** (data["m"] * data["n"]) - 1) / (data["r"] / data["m"]))

    document.querySelector('#answer').innerHTML = "Future Value of the Annuity = " + result(fvifa, true)
}

function result(factor, annuity) {
    let data = get_data()

    let result = data["am"] * factor

    if (document.getElementById('ad-true').checked && annuity) {
        result = result * (1 + data["r"])
    }

    result = parseFloat(result.toFixed(10))

    return result
}