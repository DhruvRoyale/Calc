let current_npv_years = 0;
let current_immunisation_bonds = 0;

// Does the y0 input exist
let y0 = false;

// Accepted IRR range is (-100% to 100,000%)
const LOWER_BOUND = -1
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


    // Bonds
    let bonds_rv = parseFloat(document.querySelector('#bonds-rv').value.replace(",", ""))
    let bonds_n = parseFloat(document.querySelector('#bonds-n').value.replace(",", ""))

    let bonds_ytm = parseFloat(document.querySelector('#bonds-ytm').value.replace(",", ""))
    bonds_ytm = bonds_ytm / 100

    let bonds_cr = parseFloat(document.querySelector('#bonds-cr').value.replace(",", ""))
    bonds_cr = bonds_cr / 100

    let bonds_m = parseFloat(document.querySelector('#bonds-m').value.replace(",", ""))


    // Portfolio
    let port_price_a = parseFloat(document.querySelector('#portfolio-price-a').value.replace(",", ""))
    let port_duration_a = parseFloat(document.querySelector('#portfolio-duration-a').value.replace(",", ""))
    let port_price_b = parseFloat(document.querySelector('#portfolio-price-b').value.replace(",", ""))
    let port_duration_b = parseFloat(document.querySelector('#portfolio-duration-b').value.replace(",", ""))


    // Immunisation
    let imm_obligation = parseFloat(document.querySelector('#immunisation-obligation').value.replace(",", ""))
    let imm_n = parseFloat(document.querySelector('#immunisation-n').value.replace(",", ""))
    let imm_bond_number = parseFloat(document.querySelector('#immunisation-bond-number').value.replace(",", ""))
    let imm_ytm = parseFloat(document.querySelector('#immunisation-ytm').value.replace(",", ""))
    imm_ytm = imm_ytm / 100

    let imm_m = parseFloat(document.querySelector('#immunisation-m').value.replace(",", ""))

    let imm_bonds = []
    for (let i = 1; i <= imm_bond_number; i++) {
        let rate = parseFloat(document.querySelector('#bond_rate' + i).value.replace(",", ""))
        rate = rate / 100

        let maturity = parseFloat(document.querySelector('#bond_maturity' + i).value.replace(",", ""))

        imm_bonds.push({"rate": rate, "maturity": maturity})
    }


    return {"annuity": {"am": ann_am, "n": ann_n, "r": ann_r, "m": ann_m}, 
        "perp": {"am": perp_am, "r": perp_r, "g": perp_g}, 
        "npv": {"r": npv_r, "year-values": npv_year_values},
        "bonds": {"rv": bonds_rv, "n": bonds_n, "ytm": bonds_ytm, "cr": bonds_cr, "m": bonds_m},
        "portfolio": {"price-a": port_price_a, "duration-a": port_duration_a, "price-b": port_price_b, "duration-b": port_duration_b},
        "immunisation": {"obligation": imm_obligation, "n": imm_n, "ytm": imm_ytm, "m": imm_m, "bond-number": imm_bond_number, "bonds": imm_bonds}
    }
}



function PV() {
    let data = get_data()
    document.querySelector('#ann-result').innerHTML = "Present Value = " + format(find_annuity(data["annuity"], find_pvif(data["annuity"])))
}

function find_pvif(data) {
    return (1/((1 + (data["r"] / data["m"])) ** (data["m"] * data["n"])))
}



function FV() {
    let data = get_data()
    document.querySelector('#ann-result').innerHTML = "Future Value = " + format(find_annuity(data["annuity"], find_fvif(data["annuity"])))
}

function find_fvif(data) {
    return ((1 + (data["r"] / data["m"])) ** (data["m"] * data["n"]))
}



function PVA() {
    let data = get_data()
    document.querySelector('#ann-result').innerHTML = "Present Value of the Annuity = " + format(find_annuity(data["annuity"], find_pvifa(data["annuity"]), true))
}

function find_pvifa(data) {
    return ((1 - (1 / (1 + (data["r"] / data["m"])) ** (data["m"] * data["n"]))) / (data["r"] / data["m"]))
}



function FVA() {
    let data = get_data()
    document.querySelector('#ann-result').innerHTML = "Future Value of the Annuity = " + format(find_annuity(data["annuity"], find_fvifa(data["annuity"]), true))
}

function find_fvifa(data) {
    return (((1 + (data["r"] / data["m"])) ** (data["m"] * data["n"]) - 1) / (data["r"] / data["m"]))
}



function find_annuity(data, factor, annuity=false) {
    if (annuity) {
        data["am"] = data["am"] / data["m"]
    }

    let ann_result = data["am"] * factor

    if (document.getElementById('ad-true').checked) {
        ann_result = ann_result * (1 + data["r"])
    }

    return ann_result
}



function perp() {
    let data = get_data()
    document.querySelector('#perp-result').innerHTML = "Present value of the perpetuity = " + format(find_perp(data["perp"]))
}

function find_perp(data) {
    return (data["am"] / (data["r"] - data["g"]))
}



function npv_years() {
    let new_npv_years = parseInt(document.querySelector('#npv-n').value)
    let diff = new_npv_years - current_npv_years
    let starting_year = current_npv_years + 1

    if (!y0 && new_npv_years >= 1) {
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
    document.querySelector('#npv-result').innerHTML = "NPV = " + format(find_NPV(data["npv"]["r"], data["npv"]["year-values"]))
}

function find_NPV(r, data) {
    let npv_result = 0

    for (let i = 0; i < data.length; i++) {
        npv_result += data[i] / ((1 + r) ** i)
    }

    return npv_result
}



function IRR() {
    let data = get_data()

    let irr_result = find_IRR(data["npv"]["year-values"])
    console.log(irr_result, irr_result.length)

    if (irr_result.length > 1) {
        for (let i = 0; i < irr_result.length; i++) {
            irr_result[i] = format(irr_result[i]) + "%"
        }

        document.querySelector('#npv-result').innerHTML = "The IRRs are: " + irr_result.join(", ")
    } else if (irr_result.length == 1) {
        document.querySelector('#npv-result').innerHTML = "IRR = " + format(irr_result[0]) + "%"
    } else {
        document.querySelector('#npv-result').innerHTML = "Unable to find any IRRs"
    }
}

function find_IRR(data) {
    let sign = ""
    let irr_list = []

    for (let i = LOWER_BOUND * 10000; i <= UPPER_BOUND * 10000; i++) {
        let current_irr = i / 10000
        let npv = find_NPV(current_irr / 100, data)
        
        if (npv < 0) {
            if (sign == "+") {
                irr_list.push(current_irr)
            }

            sign = "-"
        } else {
            if (sign == "-") {
                irr_list.push(current_irr)
            }

            sign = "+"
        }
    }
    return irr_list
}



function bond_price() {
    let data = get_data()
    document.querySelector('#bonds-result').innerHTML = "Bond Price = " + format(find_bond_price(data["bonds"]))
}

function find_bond_price(data) {
    let pva_data = {"am": (data["rv"] * data["cr"]),"n": data["n"],"r": data["ytm"],"m": data["m"]}
    let pva = find_annuity(pva_data, find_pvifa(pva_data), annuity=true)

    let pv_data = {"am": data["rv"],"n": data["n"],"r": data["ytm"],"m": data["m"]}
    let pv = find_annuity(pv_data, find_pvif(pv_data))
    
    return (pva + pv)
}



function bond_duration() {
    let data = get_data()
    document.querySelector('#bonds-result').innerHTML = "Duration = " + format(find_bond_duration(data["bonds"]))
}

function find_bond_duration(data) {
    data["ytm"] = data["ytm"] / data["m"]
    data["cr"] = data["cr"] / data["m"]
    data["n"] = data["n"] * data["m"]

    return ((1 + data["ytm"]) / (data["m"] * data["ytm"])) - ((1 + data["ytm"] + (data["n"] * (data["cr"] - data["ytm"]))) / ((data["m"] * data["cr"] * (((1 + data["ytm"]) ** data["n"]) - 1)) + (data["m"] * data["ytm"])))
}



function portfolio_duration() {
    let data = get_data()
    document.querySelector('#portfolio-result').innerHTML = "Portfolio Duration = " + format(find_portfolio_duration(data["portfolio"]))
}

function find_portfolio_duration(data) {
    return ((data["price-a"] * data["duration-a"]) + (data["price-b"] * data["duration-b"])) / (data["price-a"] + data["price-b"])
}



function immunisation_bonds() {
    document.getElementById('immunisation-table').hidden = false

    let new_immunisation_bonds = parseInt(document.querySelector('#immunisation-bond-number').value)
    let diff = new_immunisation_bonds - current_immunisation_bonds
    let starting_bond = current_immunisation_bonds + 1

    if (diff > 0) {
        for (let i = starting_bond; i <= new_immunisation_bonds; i++) {
            let new_row = document.createElement("tr")
            new_row.setAttribute("id", "bond" + i)

            let row_title = document.createElement("td")
            row_title.innerHTML = "Bond " + i + ": "


            let row_rate = document.createElement("td")

            let row_rate_input = document.createElement("input")
            row_rate_input.setAttribute("type", "number")
            row_rate_input.setAttribute("id", "bond_rate" + i)
            row_rate_input.setAttribute("class", "immunisation-bond")
            row_rate_input.setAttribute("name", "bond_rate" + i)

            row_rate.appendChild(row_rate_input)


            let row_maturity = document.createElement("td")

            let row_maturity_input = document.createElement("input")
            row_maturity_input.setAttribute("type", "number")
            row_maturity_input.setAttribute("id", "bond_maturity" + i)
            row_maturity_input.setAttribute("class", "immunisation-bond")
            row_maturity_input.setAttribute("name", "bond_maturity" + i)

            row_maturity.appendChild(row_maturity_input)


            new_row.appendChild(row_title)
            new_row.appendChild(row_rate)
            new_row.appendChild(row_maturity)
            
            document.getElementById('immunisation-table').appendChild(new_row)
        }

        current_immunisation_bonds = new_immunisation_bonds

    } else if (diff < 0) {
        if (new_immunisation_bonds < 1) {
            return
        }

        for (let i = current_immunisation_bonds; i > new_immunisation_bonds; i--) {
            document.getElementById('bond' + i).remove()
        }

        current_immunisation_bonds = new_immunisation_bonds
    } else {
        return
    }
}

function immunisation() {
    let data = get_data()
    let immunisation_result = find_immunisation(data["immunisation"])

    document.getElementById("immunisation-result").hidden = false

    document.querySelector("#best-bond-a").innerHTML = format(immunisation_result["bond-a"] + 1)
    document.querySelector("#best-bond-b").innerHTML = format(immunisation_result["bond-b"] + 1)
    document.querySelector("#investment-a").innerHTML = format(immunisation_result["investment-a"])
    document.querySelector("#investment-b").innerHTML = format(immunisation_result["investment-b"])
    document.querySelector("#bond-num-a").innerHTML = format(immunisation_result["num-a"])
    document.querySelector("#bond-num-b").innerHTML = format(immunisation_result["num-b"])
}

function find_immunisation(data) {
    // Find Prices and Durations
    for (let i = 0; i < data["bond-number"]; i++) {
        let bond_data = {"rv": 100, "n": data["bonds"][i]["maturity"], "ytm": data["ytm"], "cr": data["bonds"][i]["rate"], "m": data["m"]}
        let price = find_bond_price(bond_data)
        let duration = find_bond_duration(bond_data)

        data["bonds"][i].price = price
        data["bonds"][i].duration = duration
    }

    console.log(data)

    // Find highest portfolio duration that is under the amount of time that the obilgation is due
    let best_portfolio = {"bond-a": 0, "bond-b": 0, "portfolio-duration": 0}
    for (let i = 0; i < data["bond-number"]; i++) {
        for (let j = i + 1; j < data["bond-number"]; j++) {
            // Checking every unique combination of 2 bonds
            let portfolio_data = {"price-a" : data["bonds"][i]["price"], "duration-a": data["bonds"][i]["duration"], 
                "price-b" : data["bonds"][j]["price"], "duration-b": data["bonds"][j]["duration"]
            }

            let portfolio_duration = find_portfolio_duration(portfolio_data)

            if (portfolio_duration < data["n"] && portfolio_duration > best_portfolio["portfolio-duration"]) {
                best_portfolio["bond-a"] = i
                best_portfolio["bond-b"] = j
                best_portfolio["portfolio-duration"] = portfolio_duration
            }
        }
    }

    console.log(best_portfolio)

    // Find the optimal investment ratio for the best portfolio
    let pv_data = {"am": data["obligation"],"n": data["n"],"r": data["ytm"],"m": data["m"]}
    let pv_obligation = find_annuity(pv_data, find_pvif(pv_data))

    let investment_a = ((data["n"] - data["bonds"][best_portfolio["bond-b"]]["duration"]) * pv_obligation) / (data["bonds"][best_portfolio["bond-a"]]["duration"] - data["bonds"][best_portfolio["bond-b"]]["duration"])

    let investment_b = pv_obligation - investment_a

    let num_a = investment_a / data["bonds"][best_portfolio["bond-a"]]["price"]
    let num_b = investment_b / data["bonds"][best_portfolio["bond-b"]]["price"]

    return {"bond-a": best_portfolio["bond-a"], "bond-b": best_portfolio["bond-b"], "investment-a": investment_a, 
        "investment-b": investment_b, "num-a": num_a, "num-b": num_b
    }
}



function format(text) {
    return text.toLocaleString("en-US", {maximumFractionDigits: DEFAULT_ROUNDING_PLACES})
}