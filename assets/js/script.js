let selectValue1 = document.querySelector('#selectValue1');
let selectValue2 = document.querySelector('#selectValue2');
$.ajax({
    url: 'https://api.countrystatecity.in/v1/countries/IN/states',
    method: 'GET',
    headers: {
        "X-CSCAPI-KEY": "RU1oZVNOQjRieWZyQlM1alNhNFdIZkRpMm02YUhmdHVxZm9UWXo3eQ=="
    },
    success: function (res) {
        printState(res);
        resetCount(res);
    }
})

function printState(state) {
    for (let val of state) {
        selectValue1.innerHTML += `<option value="${val.name}">${val.name}</option>`
    }

    selectValue1.addEventListener('change', function select1() {
        const getEle = state.find((item) => {
            return item.name === this.value
        })
        getStateCode(getEle.iso2, this.value);
    })
}

function getStateCode(code, stateName) {
    $.ajax({
        url: 'https://data.covid19india.org/v4/min/data.min.json',
        method: 'GET',
        success: function (res) {
            getCorona(res, code, stateName)
        }
    })
}

function getCorona(res, code, stateName) {
    const CoroArr = Object.entries(res);
    const coroInfo = CoroArr.find((item) => {
        return item[0] == code
    })
    let cases = coroInfo[1].total;
    let cities = coroInfo[1].districts;
    printResult1(cases, stateName);
    getDistricts(cities);
}

let result = document.querySelector('#result');

function printResult1(cases, stateName) {
    result.innerHTML = `
        <ul class="p-0 ps-2">
            <li><span style="color:lightcoral;">PLACE: ${stateName}</span></li>
            <li class="py-3"><span style="color:lightsalmon;">TESTED: ${cases.tested}</span></li>
            <li><span style="color:lightskyblue;">CONFIRMED: ${cases.confirmed}</span></li>
            <li class="pt-3"><span style="color:violet;">DECEASED: ${cases.deceased}</span></li>
            <li class="pt-3"><span style="color:lightsteelblue;">RECOVERED: ${cases.recovered}</span></li>
        </ul>
    `
}

function getDistricts(cities) {
    const cityArr = Object.entries(cities);
    selectValue2.innerHTML = "";
    if (selectValue2.innerHTML == "") {
        selectValue2.innerHTML = `<option value="" >select District</option>`;
    }
    for (let val of cityArr) {
        selectValue2.innerHTML += `<option value="${val[0]}">${val[0]}</option>`;
    }

    getCityDetails(cityArr);
}

function getCityDetails(cityArr) {
    selectValue2.addEventListener('change', function select2() {
        const cityName = cityArr.find((item) => {
            return item[0] == this.value;
        })

        if (cityName != undefined) {
            let cases = cityName[1].total;
            printResult1(cases, this.value)
        }
    })
}

function resetCount(countryreset) {
    let reset = document.getElementById('reset');
    reset.addEventListener('click', () => {
        for (let val of countryreset) {
            selectValue1.innerHTML += `<option value="${val.name}">${val.name}</option>`
        }

        document.querySelector('#selectValue2').innerHTML = `<option id="opt" value="">Select District</option>`;
        document.querySelector('#result').innerHTML = `<h5 class="text-center text-white">CORONA INFO</h5>`;
    })
}
