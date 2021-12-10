
var fs = require('fs');
var path = require('path');
var XlsxTemplate = require('xlsx-template');
module.exports.createExcel = () => {
    let promise = new Promise( (resolve) => {
        // Load an XLSX file into memory
        fs.readFile(path.resolve(__dirname, '../templates/template1.xlsx'), async function (err, data) {
            // Create a template
            var template = new XlsxTemplate(data);
            // Replacements take place on first sheet
            var sheetNumber = 1;
            // Set up some placeholder values matching the placeholders in the template
            var values = {
                extractDate: new Date(),
                dates: [new Date('2013-06-01'), new Date('2013-06-02'), new Date('2013-06-03')],
                people: [
                    { name: 'John Smith', age: 20 },
                    { name: 'Bob Johnson', age: 22 },
                ],
            };
            // Perform substitution
            await template.substitute(sheetNumber, values);
            // Get binary data
            var data = await template.generate({type:"uint8array"});
            fs.writeFile("result.xlsx", data,Uint8Array,()=>{console.log("done");});
            //return the promise as Uint8Array
            resolve(data);
        });
    });
    return promise;
}


