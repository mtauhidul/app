import NKeyMap from 'nkeymap';

const structure = [
    // Vitals

    // BP

    [['8480-6', '8450-9', '8451-7', '8459-0', '8460-8', '8461-6'], { key: 'sbp', display: 'Systolic Blood Pressure' }],
    [['8462-4', '8446-7', '8447-5', '8453-3', '8454-1', '8455-8'], { key: 'dbp', display: 'Diastolic Blood Pressure' }],
    [['55284-4'], { key: 'bp', display: 'Blood Pressure' }],

    // TEMP
    [['8310-5', '61008-9', '8329-5', '8330-3', '11289-6', '91371-5', '8309-7', '75539-7', '8334-5', '8331-1', '60838-0', '8332-9', '8328-7', '60836-4', '60830-7', '61009-7', '60833-1'], { key: 'temp', display: 'Body Temperature' }],

    // HR
    [['8889-8', '8867-4'], { key: 'hr', display: 'Heart Rate' }],

    // RP
    [['9279-1'], { key: 'rp', display: 'Respiratory Rate' }],

    // Lab results

    // WBC
    [['26464-8', '804-5', '6690-2', '51383-8', '729-4'], { key: 'wbc', display: 'WBC' }],

    [['718-7', '17856-6'], { key: 'hmg', display: 'Hemoglobin' }],

    [['119339001'], { key: 'stsmpl', display: 'Stool Sample' }],
    // [ ["" ], { key: "", display: "" } ],
];

const map = new NKeyMap();

structure.forEach((item) => {
    map.set(...item);
})

export default map;
