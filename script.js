let current_npv_years = 0;

// Does the y0 input exist
let y0 = false;

// Accepted IRR range is (-10,000% to 10,000%)
const LOWER_BOUND = -100
const UPPER_BOUND = 100

const DEFAULT_ROUNDING_PLACES = 4

function get_data() {
    // Annuity
    let ann_am = parseFloat(document.querySelector('#ann-am').value.replace(",", ""))
    let ann_n = parseFloat(document.querySelector('#ann-n').value.replace(",", ""))
    let ann_r = parseFloat(document.querySelector('#ann-r').value.replace(",", ""))
    let ann_m = parseFloat(document.querySelector('#ann-m').value.replace(",", ""))

    ann_r = ann_r / 100

    // Perpetuity
    let perp_am = parseFloat(document.querySelector('#perp-am').value.replace(",", ""))

    let perp_r = parseFloat(document.querySelector('#perp-r').value.replace(",", ""))
    perp_r = perp_r / 100

    let perp_g
    if (document.querySelector('#perp-g').value.replace(",", "")) {
        perp_g = parseFloat(document.querySelector('#perp-g').value.replace(",", ""))
    } else {
        perp_g = 0
    }
    perp_g = perp_g / 100

    // NPV
    let npv_r = parseFloat(document.querySelector('#npv-r').value.replace(",", ""))
    npv_r = npv_r / 100

    let npv_year_values = [];
    if (y0) {
        for (let i = 0; i <= current_npv_years; i++) {
            let current_value = document.querySelector("#y" + i).value.replace(",", "")

            if (current_value) {
                npv_year_values.push(parseFloat(current_value))
            } else {
                npv_year_values.push(0)
            }
        }
    }

    return {"ann-am": ann_am, "ann-n": ann_n, "ann-r": ann_r, "ann-m": ann_m, 
        "perp-am": perp_am, "perp-r": perp_r, "perp-g": perp_g, 
        "npv-r": npv_r, "npv-year-values": npv_year_values
    }
}

function PV() {
    let data = get_data()

    let pvif = (1/((1 + (data["ann-r"] / data["ann-m"])) ** (data["ann-m"] * data["ann-n"])))

    document.querySelector('#ann-result').innerHTML = "Present Value = " + find_annuity(pvif).toLocaleString()
}

function FV() {
    let data = get_data()

    let fvif = ((1 + (data["ann-r"] / data["ann-m"])) ** (data["ann-m"] * data["ann-n"]))

    document.querySelector('#ann-result').innerHTML = "Future Value = " + find_annuity(fvif).toLocaleString()
}

function PVA() {
    let data = get_data()

    let pvifa = ((1 - (1 / (1 + (data["ann-r"] / data["ann-m"])) ** (data["ann-m"] * data["ann-n"]))) / (data["ann-r"] / data["ann-m"]))

    document.querySelector('#ann-result').innerHTML = "Present Value of the Annuity = " + find_annuity(pvifa).toLocaleString()
}

function FVA() {
    let data = get_data()

    let fvifa = (((1 + (data["ann-r"] / data["ann-m"])) ** (data["ann-m"] * data["ann-n"]) - 1) / (data["ann-r"] / data["ann-m"]))

    document.querySelector('#ann-result').innerHTML = "Future Value of the Annuity = " + find_annuity(fvifa).toLocaleString()
}

function find_annuity(factor) {
    let data = get_data()

    let ann_result = data["ann-am"] * factor

    if (document.getElementById('ad-true').checked) {
        ann_result = ann_result * (1 + data["ann-r"])
    }

    ann_result = round(ann_result, DEFAULT_ROUNDING_PLACES)

    return ann_result
}

function perp() {
    let data = get_data()

    perp_result = data["perp-am"] / (data["perp-r"] - data["perp-g"])
    perp_result = round(perp_result, DEFAULT_ROUNDING_PLACES)

    document.querySelector('#perp-result').innerHTML = "Present value of the perpetuity = " + perp_result.toLocaleString()
}

function npv_years() {
    let new_npv_years = parseInt(document.querySelector('#npv-n').value)
    let diff = new_npv_years - current_npv_years
    let starting_year = current_npv_years + 1

    if (!y0) {
        starting_year = 0
        y0 = true
    }

    if (diff > 0) {
        for (let i = starting_year; i <= new_npv_years; i++) {
            let new_year_div = document.createElement("div")
            new_year_div.setAttribute("id", "div_y" + i)

            let new_year_label = document.createElement("label")
            new_year_label.setAttribute("for", "y" + i)
            new_year_label.setAttribute("id", "label_y" + i)
            new_year_label.innerHTML = "Year " + i + ": "

            let new_year_input = document.createElement("input")
            new_year_input.setAttribute("type", "number")
            new_year_input.setAttribute("id", "y" + i)
            new_year_input.setAttribute("class", "npv-year")
            new_year_input.setAttribute("name", "y" + i)
            
            new_year_div.appendChild(new_year_label)
            new_year_div.appendChild(new_year_input)
            document.getElementById('npv-years-div').appendChild(new_year_div)
        }

        current_npv_years = new_npv_years

    } else if (diff < 0) {
        if (new_npv_years < 1) {
            return
        }

        for (let i = current_npv_years; i > new_npv_years; i--) {
            document.getElementById('div_y' + i).remove()
        }

        current_npv_years = new_npv_years
    } else {
        return
    }
}

function NPV() {
    let data = get_data()

    document.querySelector('#npv-result').innerHTML = "NPV = " + find_NPV(data["npv-r"], data["npv-year-values"]).toLocaleString()
}

function find_NPV(r, data) {
    let npv_result = 0

    for (let i = 0; i < data.length; i++) {
        npv_result += data[i] / ((1 + r) ** i)
    }

    return round(npv_result, DEFAULT_ROUNDING_PLACES)
}

function IRR() {
    let data = get_data()
    
    // Setting 0.01% of the average cash flow per year as a tolerance level around 0
    let avg_cash_flow = 0;
    for (let i = 0; i < data["npv-year-values"].length; i++) {
        avg_cash_flow += data["npv-year-values"][i] / data["npv-year-values"].length
    }

    let tolerance = avg_cash_flow * 0.0001

    let irr_result = find_IRR(LOWER_BOUND, UPPER_BOUND, tolerance, data["npv-year-values"])

    document.querySelector('#npv-result').innerHTML = "IRR = " + irr_result.toLocaleString() + "%"
}

function find_IRR(lb, ub, tolerance, data) {
    let rate = (lb + ub) / 2

    let npv_value = find_NPV(rate, data)

    // If deviation is within the tolerated amount, return
    if (Math.abs(npv_value) <= Math.abs(tolerance)) {
        return round(rate * 100, DEFAULT_ROUNDING_PLACES)
    }

    if (npv_value < 0) {
        return find_IRR(lb, rate, tolerance, data)
    } else {
        return find_IRR(rate, ub, tolerance, data)
    }
}

function round(number, dec_places) {
    return parseFloat(number.toFixed(dec_places))
}