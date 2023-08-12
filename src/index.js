import axios from "axios";
import fs from 'fs';


start();


function sort() {
    const buffer_collections = fs.readFileSync('./collections.json');
    const collections = JSON.parse(buffer_collections).item;

    const buffer_rateColections = fs.readFileSync('./rate_collections.json');
    const rateCollections = JSON.parse(buffer_rateColections).item;
    const count = 30;
    console.log("Selection du top 30");
    for(const itemRated of rateCollections) {
        for(const item of collections) {

            if(item.name == itemRated.name) {
                if(item.level < 150 && count != 0) {
                    console.log(count + " | nom : " + itemRated.name + " rate : " + itemRated.rate + " level : " + item.level);
                }
            }

        }
    }
}

function start() {
    if(!fs.existsSync('./collections.json')) {
        collectAllEquipment().then(() => {
            setTimeout(() => {
                if(fs.existsSync('./rate_collections.json')) {
                    const { birthtime } = fs.statSync('./rate_collections.json');
                    if(isOlderThan7Days(birthtime)) {
                        searchCostEffectiveItem();
                    }
                } else {
                    searchCostEffectiveItem();

                }
            } ,3000);
        });
        return;
    }
    
    if(fs.existsSync('./rate_collections.json')) {
        const { birthtime } = fs.statSync('./rate_collections.json');
        if(isOlderThan7Days(birthtime)) {
            searchCostEffectiveItem();
        }

        const buffer = fs.readFileSync('./rate_collections.json');
    }else {
        searchCostEffectiveItem();
    }
    
    console.log("Fin de la recolte de données");
    sort();




}

async function searchCostEffectiveItem() {
    const allItemsWithRate = {
        item: []
    };
    console.log('Recherche des items rentables ...')
    const file = await fs.readFileSync('./collections.json');

    const items_obj = JSON.parse(file);
    const items = items_obj.item;
    let currentItem = 0;
    for(const item of items) {
        currentItem++;
        let result = await getItem(item.name)

        for(const n of result) {
            if(n.label == item.name) {
                let itemData = await getItemRate(n.id)
                console.log("collecte des données : " + n.label + " , " + itemData.rate + " % | Avancement : " + ((currentItem / items.length) * 100).toFixed(2) + " %");

                if(itemData.rate < 200) {
                    continue;
                }

                allItemsWithRate.item.push({
                    name: n.label,
                    rate: itemData.rate,
                    dateUpdated: itemData.date
                })
            }
        }
    }

    allItemsWithRate.item.sort((a, b) => b.rate - a.rate);
    console.log("Tri de la données en cours...")
    setTimeout(() => {
        fs.writeFile('rate_collections.json', JSON.stringify(allItemsWithRate), err => {
            if (err) {
              console.log(err.message);
          
              throw err;
            }
          
            console.log('data written to file');
          });
    }, 10000)

    
}

async function getItemRate(id) {
    const request = await axios.get('https://profus.net/getItemBreakRatio/213/' + id);
    const data = request.data;
    return data;
}

async function getItem(name) {
    const request = await axios.get('https://profus.net/lookItems/' + name);
    const data = request.data;
    return data.results;
}

async function collectAllEquipment() {
    let maxPages = 36;

    const json = {
        item: []
    };

    for(let currentPage = 1; currentPage < maxPages; currentPage++) {
        let pourcentageAvance = (currentPage / maxPages) * 100;
        console.log('Collecte des équipements : ' + Math.round(pourcentageAvance) + "%");
        const request = await axios.get(`https://enc.dofusdu.de/dofus/en/equipment?page%5Bnumber%5D=${currentPage}&page%5Bsize%5D=96`)
        if(request.status != 200) {
            console.log('Une erreur est survenue veuillez contacter le créateur');
            break;
        }
        
        const data = request.data;
        const items = data.items;

        let currentItem = 0;
        for(const item of items) {
            currentItem++;
            const requestStats = await axios.get('https://enc.dofusdu.de/dofus/en/equipment/' + item.ankama_id);
            
            const dataStats = requestStats.data;
            console.log("Verifications des statistique pour la page " + currentPage + " | " + Math.round((currentItem / 96) * 100) + "%");
            if(dataStats.level > 100) {
                json.item.push({...item, level: dataStats.level});
            }

        }
                
    }

    console.log("Nombre total d'équipement récupéré : " + json.item.length);

    fs.writeFile('collections.json', JSON.stringify(json), err => {
        if (err) {
          console.log(err.message);
      
          throw err;
        }
      
        console.log('data written to file');
      });
      

}

function isOlderThan7Days(timestamp) {
    const now = Date.now(); 
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; 

    const sevenDaysAgo = now - oneWeekInMillis;

    return timestamp < sevenDaysAgo;
}

