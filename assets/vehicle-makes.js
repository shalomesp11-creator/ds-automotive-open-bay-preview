/* Curated passenger-car makes, including historical and international brands.
 * TASK-006.md documents scope, sources, aliases, and update instructions.
 * MG Motor is a search alias of MG, not a duplicate display entry. */
window.VEHICLE_MAKES = (() => {
  const names = [
    'Abarth', 'AC', 'Acura', 'Alfa Romeo', 'Alpina', 'Alpine', 'Alvis', 'AMC',
    'Aston Martin', 'Auburn', 'Audi', 'Austin', 'Austin-Healey', 'Avanti',
    'Baojun', 'Bentley', 'BMW', 'Borgward', 'Bricklin', 'Bugatti', 'Buick', 'BYD',
    'Cadillac', 'Caterham', 'Changan', 'Chery', 'Chevrolet', 'Chrysler', 'Citroën',
    'Cord', 'CUPRA', 'Dacia', 'Daewoo', 'Daihatsu', 'Daimler', 'Datsun',
    'De Tomaso', 'DeLorean', 'Denza', 'DeSoto', 'Dodge', 'DS Automobiles',
    'Duesenberg', 'Eagle', 'Edsel', 'Excalibur', 'FAW', 'Ferrari', 'Fiat',
    'Fisker', 'Ford', 'GAC', 'Geely', 'Genesis', 'Geo', 'GMC', 'Great Wall',
    'Haval', 'Hillman', 'Holden', 'Honda', 'Hongqi', 'Hudson', 'Hummer',
    'Hupmobile', 'Hyundai', 'INEOS', 'Infiniti', 'International Harvester',
    'Iso', 'Isuzu', 'Jaguar', 'Jeep', 'Jensen', 'Kaiser', 'Karma', 'KG Mobility',
    'Kia', 'Koenigsegg', 'Lada', 'Lamborghini', 'Lancia', 'Land Rover',
    'Leapmotor', 'Lexus', 'Li Auto', 'Lincoln', 'Lotus', 'Lucid', 'Lynk & Co',
    'Mahindra', 'Marcos', 'Maserati', 'Maybach', 'Mazda', 'McLaren',
    'Mercedes-Benz', 'Mercury', 'Merkur', 'MG', 'MINI', 'Mitsubishi', 'Morgan',
    'Morris', 'Moskvitch', 'Nash', 'NIO', 'Nissan', 'Noble', 'Oldsmobile',
    'Opel', 'Packard', 'Pagani', 'Panhard', 'Panoz', 'Perodua', 'Peugeot',
    'Pierce-Arrow', 'Pininfarina', 'Plymouth', 'Polestar', 'Pontiac', 'Porsche',
    'Proton', 'Ram', 'Rambler', 'Renault', 'Riley', 'Rivian', 'Rolls-Royce',
    'Rover', 'Saab', 'Saleen', 'Saturn', 'Scion', 'SEAT', 'Shelby', 'Simca',
    'Singer', 'Škoda', 'Smart', 'Spyker', 'SsangYong', 'Studebaker', 'Subaru',
    'Sunbeam', 'Suzuki', 'Talbot', 'Tata', 'Tatra', 'Tesla', 'Toyota', 'Trabant',
    'Triumph', 'Tucker', 'TVR', 'Vauxhall', 'VinFast', 'Volkswagen', 'Volvo',
    'Voyah', 'Wartburg', 'Wiesmann', 'Willys', 'Wolseley', 'Wuling', 'XPeng',
    'Yugo', 'Zastava', 'Zeekr'
  ];
  const aliases = {
    'Chevrolet': ['Chevy'], 'Mercedes-Benz': ['Benz', 'Mercedes', 'MB'],
    'Volkswagen': ['VW', 'Volks Wagen'], 'BMW': ['Beemer', 'Bimmer'],
    'Alfa Romeo': ['Alfa'], 'AMC': ['American Motors'], 'BYD': ['Build Your Dreams'],
    'DS Automobiles': ['DS'], 'GAC': ['Guangzhou Automobile'],
    'Great Wall': ['GWM', 'Great Wall Motors'], 'International Harvester': ['International', 'IH'],
    'KG Mobility': ['KGM'], 'Li Auto': ['Li Xiang', 'Lixiang'],
    'Lynk & Co': ['Lynk and Co'], 'MG': ['MG Motor', 'Morris Garages'],
    'MINI': ['Mini Cooper'], 'Ram': ['Dodge Ram'], 'Škoda': ['Skoda'],
    'SsangYong': ['Ssang Yong'], 'Willys': ['Willys-Overland'], 'XPeng': ['X Peng']
  };
  return names.sort((a, b) => a.localeCompare(b, 'en-US', { sensitivity: 'base' }))
    .map(name => ({ name, aliases: aliases[name] || [] }));
})();
