const moment = require('moment-timezone');
module.exports = (students) => {
  const month = "08";
    
    const filteredStudents 
      = students.map(student => {
                  return student.feeHistory
                                .map(entry =>{ 
                                    const currDate= moment(entry.date).tz('Asia/Kolkata').format('DD/MM/YYYY');
                                      return currDate.slice(3, 5) === month ? student : null;
                                    }
                                  )  
                }
              );

    console.log(filteredStudents);
    
  

   const today = new Date();
   return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .invoice-box {
               max-width: 800px;
               margin: auto;
               padding: 30px;
               border: 1px solid #eee;
               box-shadow: 0 0 10px rgba(0, 0, 0, .15);
               font-size: 16px;
               line-height: 24px;
               font-family: 'Helvetica Neue', 'Helvetica',
               color: #555;
             }
             .margin-top {
               margin-top: 50px;
             }
             .justify-center {
               text-align: center;
             }
             .invoice-box table {
               width: 100%;
               line-height: inherit;
               text-align: left;
               border-collapse: collapse; /* Add this for border collapse */
             }
             .invoice-box table, .invoice-box table th, .invoice-box table td {
               border: 1px solid #ddd; /* Add border to table, th, and td */
             }
             .invoice-box table td {
               padding: 8px;
               vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
               text-align: right;
             }
             .invoice-box table tr.top table td {
               padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
               font-size: 45px;
               line-height: 45px;
               color: #333;
             }
             .invoice-box table tr.information table td {
               padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
               background: #eee;
               border-bottom: 2px solid #ddd;
               font-weight: bold;
             }
             .invoice-box table tr.details td {
               padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
               border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
               border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
               border-top: 2px solid #eee;
               font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
               .invoice-box table tr.top table td {
                 width: 100%;
                 display: block;
                 text-align: center;
               }
               .invoice-box table tr.information table td {
                 width: 100%;
                 display: block;
                 text-align: center;
               }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
            <h1>Dancer's Spce</h1>
            <h2>${  new Date().toLocaleDateString("en-US", {month: "long", year:"numeric"})} Fee Report</h2>
             <table cellpadding="0" cellspacing="0">
               <thead>
                  <tr>
                     <th>Name</th>
                     <th>Fee-Status</th>
                     <th>Balance</th>
                  </tr>
               </thead>

               <tbody>
               ${
                students.map(student => (
                     `
                               <tr>
                                    <td class="title">
                                        ${student.name}
                                    </td>
                                    <td>
                                        ${student.feeHistory[student.feeHistory.length-1].status}
                                    </td>
                                    <td>
                                       ${student.feeHistory[student.feeHistory.length-1].balance }
                                    </td>
                               </tr>
                     `
                  )).join('')
               }
               </tbody>
             </table>
             <br />
          </div>
       </body>
    </html>
    `;
};
