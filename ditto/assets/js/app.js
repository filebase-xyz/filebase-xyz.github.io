
    import {createApp} from "../../node_modules/vue/dist/vue.esm-browser.js";


    function camelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index)
        {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    function csvToObject(csv){

        var lines=csv.replace("\r", "").split("\n");
      
        var result = [];
      
        var headers=lines[0].toLowerCase().split("\t").map(i => camelCase(i.trim()));
      
        for(var i=1;i<lines.length;i++){
      
            var obj = {};
            var currentline=lines[i].split("\t");
      
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j].trim();
            }
      
            result.push(obj);
        }
      
        return  JSON.parse(JSON.stringify(result)); //JSON;
      }

    createApp({

        data(){
            return {
                title: 'DittoApp',
                list: [],
                searchText: '',
                selectedType: ''
            }
        },
        computed:{
            types(){
                let set = new Set(this.getList.map(item => item.type.trim()));

                let result = [...set];
                if(!result.includes(this.selectedType)){
                    this.selectedType = '';
                }

                return result;
            },
            getListAfterFilter(){

                if(this.selectedType){
                    return this.getList.filter(item => item.type === this.selectedType);
                }

                return this.getList;
            },
            getList(){

                let s = this.searchText.trim().toLowerCase();
                return this.list.filter(item => {

                    const searchFields = ['symbol', 'description'];

                    for(let key of searchFields){
                        let field = item[key].trim().toLowerCase();

                        if(field.includes(s)) return true;
                    }

                    return false;
                });

            }
        },
        async mounted(){
            //const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmrxth-ejlEwRCXjsEFhaiHC1h9O9NJBhfdRMmGt1aKGFe3SILXojhENZ8qBre5w/pub?gid=1738666649&single=true&output=csv';


            const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmrxth-ejlEwRCXjsEFhaiHC1h9O9NJBhfdRMmGt1aKGFe3SILXojhENZ8qBre5w/pub?output=tsv';

            let data = await fetch(URL);
                data = await data.text();

                data = csvToObject(data);

                this.list = data;

            console.log(data);

        }

    }).mount('#app');