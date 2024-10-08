const fs = require('fs');
const path = require('path')
const {
    parse
} = require('csv-parse');

const planets = require('./planets.mongoose');
const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..','..','/data','kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                   await planets.create({
                    keplerName : data.kepler_name,
                   });
                }
                // habitablePlanets.push(data)
            })
            .on('err', (err) => {
                console.log(err)
                reject(err)
            })
            .on('end', () => {
                console.log(`${habitablePlanets.length} habitable planets found! (data by nasa)`)
                console.log('Done!')
                resolve()
            })
    })
}

async function getAllPlanets(){
    return await planets.find({});
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}