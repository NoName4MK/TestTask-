import fs = require('fs');

/**
 * Разработайте тесты для функции isEven() 
 * 
 */

export function isEven( num: number): boolean {
    // Returns True if **num** is even or False if it is odd.
    //return num % 2?false:true;
    return Boolean(num % 2);
}

function testisEven(value:boolean){
    return {
        toBeResult: (exp: boolean) =>{
            if(exp===value){ 
                console.log('Sucses');
            } else {
                console.log(`Error Result, value is ${value}, but expectation ${exp} `)
            }
        }
    }

}

testisEven(isEven(0)).toBeResult(true);
testisEven(isEven(2)).toBeResult(true);
testisEven(isEven(3)).toBeResult(false);

/**
 * 
 * Разработайте функцию getScore()
 * 
 */

const emptyScoreStamp = {
    offset: 0,
    score: {
        home: 0,
        away: 0
    }
};

export const scoreStamps = Array(10).fill(emptyScoreStamp).map(
    ((acc) => () => {
            const scoreChanged = Math.random() > 0.9999;
            const homeScoreChange = scoreChanged && Math.random() > 0.55 ? 1 : 0;
            const awayScoreChange = scoreChanged && !homeScoreChange ? 1 : 0;
            return {
                offset: acc.offset += Math.floor(Math.random() * 3) + 1,
                score: {
                    home: acc.score.home += homeScoreChange,
                    away: acc.score.away += awayScoreChange
                }
            };
        }
    )(emptyScoreStamp)
);

export const getScore = (offset: number) : {home: number, away: number} => {
    // console.log({...scoreStamps.filter(item=>item.offset==offset).map(el=> el.score).shift()});
    return {...scoreStamps.filter(item=>item.offset==offset).map(el=> el.score)[0]}
}

console.log(getScore(scoreStamps[2].offset));

/**
 * 
 * Разработать преобразователь формата
 * 
 */


const readFile = async (name: string) =>{ 

    return new Promise((resolve,reject)=>{
        fs.readFile(`${name}.csv`,'utf8',(err,data)=>{
            if (err) {
                reject(err);
            }
            let arrayBook = data.trim().split('\n').map(el=>el.split(';'));
            const arrayHaderBook = arrayBook.shift();
            const authors = new Set(arrayBook.map(el=>el[1]));
            const obj =[...authors].map(author =>{
                return {
                    author: author,
                    books: [
                        ...arrayBook.filter(el=>el[1]==author).map(el=>{
                            return {
                                title: el[0],
                                description: el[2]
                            }
                            
                        })
                    ]
                }
            });
            obj.sort((author1, author2): number =>{
                if (author1.author > author2.author){
                    return 1;
                }
                if(author1.author < author2.author){
                    return -1;
                }
                return 0;
            });  
            resolve(obj);     

        });
    });
}


async function createFile(name: string, data:any) {
    fs.appendFile(`${name}.json`, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}



;
export async function convertCsvToJson(){
    const name = 'books';
    try {
        const data = await readFile(name);
        const status = createFile(name, data);
    }
    catch(err){
        console.log(err);
    }
}

convertCsvToJson();

