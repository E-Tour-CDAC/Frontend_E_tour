import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = [
    { id: 1, cat: 1001, day: 1, desc: 'Arrival in Paris: Seine Cruise', keyword: 'paris,seine' },
    { id: 2, cat: 1001, day: 2, desc: 'Eiffel Tower & Louvre', keyword: 'eiffel,louvre' },
    { id: 3, cat: 1001, day: 3, desc: 'Paris Day Trip: Disney', keyword: 'disneyland,paris' },
    { id: 4, cat: 1001, day: 4, desc: 'TGV To Geneva', keyword: 'tgv,train' },
    { id: 5, cat: 1001, day: 5, desc: 'Geneva to Interlaken via Train', keyword: 'interlaken,switzerland' },
    { id: 6, cat: 1001, day: 6, desc: 'Jungfraujoch Top of Europe', keyword: 'jungfraujoch,snow' },
    { id: 7, cat: 1001, day: 7, desc: 'Lucerne City Tour', keyword: 'lucerne,switzerland' },
    { id: 8, cat: 1001, day: 8, desc: 'Mt. Titlis', keyword: 'titlis,mountain' },
    { id: 9, cat: 1001, day: 9, desc: 'Zurich Departure', keyword: 'zurich,airport' },
    { id: 10, cat: 1002, day: 1, desc: 'Madrid Arrival', keyword: 'madrid,city' },
    { id: 11, cat: 1002, day: 2, desc: 'Madrid City Tour', keyword: 'madrid,plaza' },
    { id: 12, cat: 1002, day: 3, desc: 'To Seville', keyword: 'seville,spain' },
    { id: 13, cat: 1002, day: 4, desc: 'Seville Cathedral', keyword: 'seville,cathedral' },
    { id: 14, cat: 1002, day: 5, desc: 'To Barcelona', keyword: 'barcelona,city' },
    { id: 15, cat: 1002, day: 6, desc: 'Sagrada Familia', keyword: 'sagrada,familia' },
    { id: 16, cat: 1002, day: 7, desc: 'Park Guell', keyword: 'park,guell' },
    { id: 17, cat: 1002, day: 8, desc: 'Departure', keyword: 'airport,departure' },
    { id: 18, cat: 1003, day: 1, desc: 'Bangkok Arrival', keyword: 'bangkok,city' },
    { id: 19, cat: 1003, day: 2, desc: 'Pattaya Coral Island', keyword: 'pattaya,beach' },
    { id: 20, cat: 1003, day: 3, desc: 'Pattaya to Bangkok', keyword: 'thailand,road' },
    { id: 21, cat: 1003, day: 4, desc: 'Safari World', keyword: 'safari,animal' },
    { id: 22, cat: 1003, day: 5, desc: 'Shopping', keyword: 'shopping,mall' },
    { id: 23, cat: 1003, day: 6, desc: 'Departure', keyword: 'airport,departure' },
    { id: 24, cat: 1004, day: 1, desc: 'Tokyo Arrival', keyword: 'tokyo,city' },
    { id: 25, cat: 1004, day: 2, desc: 'Tokyo City Tour', keyword: 'tokyo,tower' },
    { id: 26, cat: 1004, day: 3, desc: 'Mt Fuji Day Trip', keyword: 'fuji,mountain' },
    { id: 27, cat: 1004, day: 4, desc: 'Bullet Train to Kyoto', keyword: 'shinkansen,train' },
    { id: 28, cat: 1004, day: 5, desc: 'Kyoto Temples', keyword: 'kyoto,temple' },
    { id: 29, cat: 1004, day: 6, desc: 'Osaka Day Trip', keyword: 'osaka,castle' },
    { id: 30, cat: 1004, day: 7, desc: 'Departure', keyword: 'airport,departure' },
    { id: 31, cat: 1005, day: 1, desc: 'Dubai Arrival & Dhow Cruise', keyword: 'dubai,dhow' },
    { id: 32, cat: 1005, day: 2, desc: 'City Tour & Palm Jumeirah', keyword: 'palm,jumeirah' },
    { id: 33, cat: 1005, day: 3, desc: 'Burj Khalifa Top View', keyword: 'burj,khalifa' },
    { id: 34, cat: 1005, day: 4, desc: 'Desert Safari with BBQ', keyword: 'desert,safari' },
    { id: 35, cat: 1005, day: 5, desc: 'Abu Dhabi Mosque', keyword: 'sheikh,zayed' },
    { id: 36, cat: 1005, day: 6, desc: 'Miracle Garden & Frame', keyword: 'miracle,garden' },
    { id: 37, cat: 1005, day: 7, desc: 'Departure', keyword: 'airport,departure' },
    { id: 38, cat: 1006, day: 1, desc: 'JFK Arrival', keyword: 'nyc,airport' },
    { id: 39, cat: 1006, day: 2, desc: 'Statue of Liberty', keyword: 'statue,liberty' },
    { id: 40, cat: 1006, day: 3, desc: 'Empire State & Times Square', keyword: 'times,square' },
    { id: 41, cat: 1006, day: 4, desc: 'Central Park', keyword: 'central,park' },
    { id: 42, cat: 1006, day: 5, desc: 'Washington DC Day Trip', keyword: 'washington,dc' },
    { id: 43, cat: 1006, day: 6, desc: 'Philadelphia Trip', keyword: 'philadelphia,city' },
    { id: 44, cat: 1006, day: 7, desc: 'Departure', keyword: 'airport,departure' },
    { id: 45, cat: 2001, day: 1, desc: 'Shimla Arrival', keyword: 'shimla,mountain' },
    { id: 46, cat: 2001, day: 2, desc: 'Shimla & Kufri', keyword: 'kufri,snow' },
    { id: 47, cat: 2001, day: 3, desc: 'Shimla to Manali', keyword: 'manali,road' },
    { id: 48, cat: 2001, day: 4, desc: 'Manali Local', keyword: 'hadimba,temple' },
    { id: 49, cat: 2001, day: 5, desc: 'Solang Valley Snow', keyword: 'solang,valley' },
    { id: 50, cat: 2001, day: 6, desc: 'Manali to Dharamshala', keyword: 'dharamshala,cricket' },
    { id: 51, cat: 2001, day: 7, desc: 'Dalhousie Visit', keyword: 'dalhousie,pine' },
    { id: 52, cat: 2001, day: 8, desc: 'Departure', keyword: 'airport,departure' },
    { id: 53, cat: 2002, day: 1, desc: 'Srinagar Arrival', keyword: 'srinagar,lake' },
    { id: 54, cat: 2002, day: 2, desc: 'Gulmarg Gondola', keyword: 'gulmarg,snow' },
    { id: 55, cat: 2002, day: 3, desc: 'Pahalgam Valley', keyword: 'pahalgam,river' },
    { id: 56, cat: 2002, day: 4, desc: 'Sonmarg Day Trip', keyword: 'sonmarg,meadow' },
    { id: 57, cat: 2002, day: 5, desc: 'Dal Lake Shikara', keyword: 'shikara,boat' },
    { id: 58, cat: 2002, day: 6, desc: 'Departure', keyword: 'airport,departure' },
    { id: 59, cat: 2003, day: 1, desc: 'Kochi Arrival', keyword: 'kochi,net' },
    { id: 60, cat: 2003, day: 2, desc: 'Munnar Tea Gardens', keyword: 'munnar,tea' },
    { id: 61, cat: 2003, day: 3, desc: 'Thekkady Spice Tour', keyword: 'thekkady,elephant' },
    { id: 62, cat: 2003, day: 4, desc: 'Alleppey Houseboat', keyword: 'alleppey,houseboat' },
    { id: 63, cat: 2003, day: 5, desc: 'Kovalam Beach', keyword: 'kovalam,beach' },
    { id: 64, cat: 2003, day: 6, desc: 'Trivandrum Temple', keyword: 'padmanabhaswamy,temple' },
    { id: 65, cat: 2003, day: 7, desc: 'Departure', keyword: 'airport,departure' },
    { id: 66, cat: 2004, day: 1, desc: 'Port Blair Arrival', keyword: 'port,blair' },
    { id: 67, cat: 2004, day: 2, desc: 'Havelock Island Ferry', keyword: 'havelock,island' },
    { id: 68, cat: 2004, day: 3, desc: 'Radhanagar Beach', keyword: 'radhanagar,beach' },
    { id: 69, cat: 2004, day: 4, desc: 'Elephant Beach Water Sports', keyword: 'scuba,diving' },
    { id: 70, cat: 2004, day: 5, desc: 'Neil Island', keyword: 'neil,island' },
    { id: 71, cat: 2004, day: 6, desc: 'Departure', keyword: 'airport,departure' },
    { id: 72, cat: 2005, day: 1, desc: 'Goa Arrival', keyword: 'goa,airport' },
    { id: 73, cat: 2005, day: 2, desc: 'North Goa Forts', keyword: 'aguada,fort' },
    { id: 74, cat: 2005, day: 3, desc: 'South Goa Churches', keyword: 'goa,church' },
    { id: 75, cat: 2005, day: 4, desc: 'Dudhsagar Falls', keyword: 'dudhsagar,waterfall' },
    { id: 76, cat: 2005, day: 5, desc: 'Departure', keyword: 'airport,departure' },
    { id: 77, cat: 2006, day: 1, desc: 'Jaipur Arrival', keyword: 'jaipur,palace' },
    { id: 78, cat: 2006, day: 2, desc: 'Jaipur Forts', keyword: 'amber,fort' },
    { id: 79, cat: 2006, day: 3, desc: 'To Jodhpur', keyword: 'jodhpur,blue' },
    { id: 80, cat: 2006, day: 4, desc: 'Mehrangarh Fort', keyword: 'mehrangarh,fort' },
    { id: 81, cat: 2006, day: 5, desc: 'To Udaipur via Ranakpur', keyword: 'ranakpur,temple' },
    { id: 82, cat: 2006, day: 6, desc: 'Udaipur Lakes', keyword: 'udaipur,lake' },
    { id: 83, cat: 2006, day: 7, desc: 'Udaipur Shopping', keyword: 'rajasthan,market' },
    { id: 84, cat: 2006, day: 8, desc: 'Departure', keyword: 'airport,departure' },
    { id: 85, cat: 301, day: 1, desc: 'Arrival Haridwar: Ganga Aarti', keyword: 'haridwar,ganga' },
    { id: 86, cat: 301, day: 2, desc: 'Haridwar to Barkot', keyword: 'himalaya,road' },
    { id: 87, cat: 301, day: 3, desc: 'Yamunotri Trek', keyword: 'yamunotri,temple' },
    { id: 88, cat: 301, day: 4, desc: 'Barkot to Uttarkashi', keyword: 'uttarkashi,river' },
    { id: 89, cat: 301, day: 5, desc: 'Gangotri Darshan', keyword: 'gangotri,temple' },
    { id: 90, cat: 301, day: 6, desc: 'Uttarkashi to Guptkashi', keyword: 'guptkashi,temple' },
    { id: 91, cat: 301, day: 7, desc: 'Kedarnath Darshan', keyword: 'kedarnath,temple' },
    { id: 92, cat: 301, day: 8, desc: 'Return to Guptkashi', keyword: 'guptkashi,view' },
    { id: 93, cat: 301, day: 9, desc: 'Badrinath Darshan', keyword: 'badrinath,temple' },
    { id: 94, cat: 301, day: 10, desc: 'Mana Village visit', keyword: 'mana,village' },
    { id: 95, cat: 301, day: 11, desc: 'Rishikesh Visit', keyword: 'rishikesh,bridge' },
    { id: 96, cat: 301, day: 12, desc: 'Departure', keyword: 'airport,departure' },
    { id: 97, cat: 302, day: 1, desc: 'Varanasi Arrival', keyword: 'varanasi,ghat' },
    { id: 98, cat: 302, day: 2, desc: 'Ganga Aarti', keyword: 'ganga,aarti' },
    { id: 99, cat: 302, day: 3, desc: 'Sarnath Tour', keyword: 'sarnath,stupa' },
    { id: 100, cat: 302, day: 4, desc: 'Kashi Vishwanath', keyword: 'kassh,temple' },
    { id: 101, cat: 302, day: 5, desc: 'Departure', keyword: 'airport,departure' },
    { id: 102, cat: 401, day: 1, desc: 'Arrival Manali', keyword: 'manali,view' },
    { id: 103, cat: 401, day: 2, desc: 'Manali to Jobra', keyword: 'jobra,trek' },
    { id: 104, cat: 401, day: 3, desc: 'Jobra to Hampta Base', keyword: 'hampta,pass' },
    { id: 105, cat: 401, day: 4, desc: 'Hampta Pass Crossing', keyword: 'himalaya,snow' },
    { id: 106, cat: 401, day: 5, desc: 'Chandratal Lake', keyword: 'chandratal,lake' },
    { id: 107, cat: 401, day: 6, desc: 'Return to Manali', keyword: 'rohtang,pass' },
    { id: 108, cat: 402, day: 1, desc: 'Rishikesh Arrival', keyword: 'rishikesh,yoga' },
    { id: 109, cat: 402, day: 2, desc: 'Cliff Jumping', keyword: 'cliff,jumping' },
    { id: 110, cat: 402, day: 3, desc: 'River Rafting', keyword: 'river,rafting' },
    { id: 111, cat: 402, day: 4, desc: 'Departure', keyword: 'airport,departure' },
];

// Determine output directory
const baseDir = path.join(__dirname, '../public/images');
const internationalDir = path.join(baseDir, 'International');
const domesticDir = path.join(baseDir, 'Domestic');

if (!fs.existsSync(internationalDir)) fs.mkdirSync(internationalDir, { recursive: true });
if (!fs.existsSync(domesticDir)) fs.mkdirSync(domesticDir, { recursive: true });

let sqlContent = 'USE etour;\n\n';

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const req = https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Resolve relative URLs in redirects
                if (!response.headers.location) {
                    reject(new Error('Redirect with no location'));
                    return;
                }
                const newUrl = new URL(response.headers.location, url).toString();
                // console.log(`Redirecting to ${newUrl}`); 
                downloadImage(newUrl, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Status code: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        });

        req.on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

async function processImages() {
    console.log('Starting image download...');

    for (const item of data) {
        const isInternational = item.cat >= 1001 && item.cat <= 1006;
        const subDir = isInternational ? 'International' : 'Domestic';
        const targetDir = isInternational ? internationalDir : domesticDir;

        // Sanitize keyword for filename
        const filename = `${item.id}_${item.keyword.split(',')[0].replace(/\s+/g, '_')}.jpg`;
        const filePath = path.join(targetDir, filename);
        const dbPath = `/images/${subDir}/${filename}`;

        try {
            console.log(`Downloading ${filename} for ${item.desc}...`);
            await downloadImage(`https://loremflickr.com/800/600/${item.keyword}`, filePath);

            // Append SQL
            sqlContent += `UPDATE itinerary_master SET day_wise_image = '${dbPath}' WHERE itinerary_id = ${item.id};\n`;

            // Be polite to the server
            await new Promise(r => setTimeout(r, 200));

        } catch (error) {
            console.error(`Failed to download for ID ${item.id}:`, error.message);
        }
    }

    fs.writeFileSync(path.join(__dirname, '../update_images.sql'), sqlContent);
    console.log('SQL script generated at update_images.sql');
}

processImages();
