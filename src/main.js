const mainContainer = document.getElementById("maincontainer");

const supbaseUrl = "https://vnkmsolriwnyfumugehk.supabase.co";
const supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua21zb2xyaXdueWZ1bXVnZWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYwMTkwNzAsImV4cCI6MjAzMTU5NTA3MH0.9CV9KEzuGaWs6yQ44M8HkhVMMjJCmPa0YY_gK3cLV8A";
const supabaseClient = supabase.createClient(supbaseUrl, supabaseApiKey);

async function getValidKeys() {
    let result = []
    const { data, error } = await supabaseClient.from('userkeys').select();

    if (error) {
        return result.push("mahana");
    }
    for (let i = 0; i < data.length; i++) {
        _element = data[i];
        result.push(_element.user_key);
    }

    return result;
}



let one_hour = 1000 * 60 * 60;

async function addSupabaseItem() {
    const validKeys = await getValidKeys();
    let addItemResultElement = document.getElementById("addItemResult");
    let keyElement = document.getElementById("key");

    if (!validKeys.includes(keyElement.value)) {
        addItemResultElement.innerText = "Invalid Key!!!!";

    } else {

        let start_time_value = document.getElementById("start_time").value;
        let end_time_value = document.getElementById("end_time").value;

        let date = start_time_value.split("T")[0];

        let startTime = Date.parse(start_time_value);
        let endTime = Date.parse(end_time_value);

        let hours = (endTime - startTime) / one_hour;
        let start_time = start_time_value.split("T")[1];
        let end_time = end_time_value.split("T")[1];

        const { status, error } = await supabaseClient.from('shiftTracker').insert({ date: date, start_time: start_time, end_time: end_time, hours: hours });
        if (status == 201) {
            addItemResultElement.innerText = "Date : " + date + " | Start Time: " + start_time + " | End Time : " + end_time + " | Hours : " + hours;
        } else {
            console.log(error)
            addItemResultElement.innerText = "Unable to add item | " + error.message;
        }

    }
}


async function getSupabaseData() {
    const result = await supabaseClient.from('shiftTracker').select('date,start_time,end_time,hours');
    if (result.error) {
        return error.message;
    }
    console.log(result);
    return result.data;
}

const myGridElement = document.getElementById("myGrid");
const gridColumns = [
    { id: 'date', name: 'Date' },
    { id: 'start_time', name: 'Start Time' },
    { id: 'end_time', name: 'End Time' },
    { id: 'hours', name: 'Hours' },
];
const getDataBtn = document.getElementById("getData");
const updateDataBtn = document.getElementById("updateData");

async function displayGrid() {
    const validKeys = await getValidKeys();
    let keyElement = document.getElementById("key");
    let addItemResultElement = document.getElementById("addItemResult");

    if (!validKeys.includes(keyElement.value)) {
        addItemResultElement.innerText = "Invalid Key!!!!";
    } else {
        let gridData = await getSupabaseData();
        new gridjs.Grid({
            columns: gridColumns,
            pagination: {
                limit: 10
            },
            data: gridData,
        }).render(myGridElement);
    }
}
