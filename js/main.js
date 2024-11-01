let heroes = heroesArray;
let isEmerald = true;
document.body.dataset.emerald = isEmerald;

function checkEmerald() {
	let emeraldSaved = localStorage.getItem('emerald');
	if (emeraldSaved) {
		isEmerald = JSON.parse(emeraldSaved);
		if (isEmerald == true) {
			document.body.dataset.emerald = isEmerald;
			emeralder.checked = isEmerald;
		} else {
			document.body.dataset.emerald = '';
			emeralder.checked = false;
		}
	} else {
		isEmerald = emeralder.checked;
		document.body.dataset.emerald = isEmerald;
		localStorage.setItem('emerald', JSON.stringify(isEmerald));
	}
}
//checkEmerald();

heroes.sort((function(index){
    return function(a, b){
        return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
    };
})(0));

document.addEventListener("DOMContentLoaded", function () {

	document.body.classList.add("loaded");

	document.querySelector('.hero-count span').innerHTML = heroes.length;

	// Function to save selected items to localstorage
	function savePins(savedPins) {
		localStorage.setItem('savedPins', JSON.stringify(savedPins));
	}
	
	// Function to retrieve selected items from localstorage
	function getSavedPins() {
		const savedPins = localStorage.getItem('savedPins');
		if (savedPins) {
		return JSON.parse(savedPins);
		}
		return [];
	}

	// Function to toggle an item's selection state
	function togglePinState(heroName, savedPins) {
		const itemIndex = savedPins.indexOf(heroName);
		if (itemIndex === -1) {
		// Item is not currently selected, so add it
		savedPins.push(heroName);
		} else {
		// Item is already selected, so remove it
		savedPins.splice(itemIndex, 1);
		}
		// Save the updated selection state to localstorage
		savePins(savedPins);

		heroGrid.updateSortData();
		heroGrid.arrange();
	}

	let savedPins = getSavedPins();

	function concatValues( obj ) {
		var value = '';
		for ( var prop in obj ) {
			value += obj[ prop ];
		}
		return value;
	}

	let heroGrid;

	function filterFunctions() {

		imagesLoaded('.heroes-grid', function(){

			let filterValue;
			let searchRE;

			heroGrid = new Isotope('.heroes', {
				itemSelector: '.hero',
				layoutMode: 'fitRows',
				percentPosition: true,
				getSortData: {
					pinned: function(item){
						let pinned = (item.dataset.pinned == 'true') ? 1 : 2;
						return pinned;
					},
					name: '.name h3'
				},
				sortBy: ['pinned', 'name'],
				filter: function(elem){
					let name = elem.querySelector('.name h3').firstChild.nodeValue;
					let searchResult = searchRE ? name.match(searchRE) : true;
					let dropResult = filterValue ? elem.matches(filterValue) : true;
					return searchResult && dropResult;
				}
			});

			let selects = document.querySelectorAll('select');

			let filters = {};

			Array.from(selects).forEach(function(select) {

				select.addEventListener('change', function(e) {

					let type = this.dataset.type;
					let value = this.value;

					if (value.length) {
						this.classList.add('checked')
					} else {
						this.classList.remove('checked')
					}

					filters[type] = value;

					filterValue = concatValues(filters);

					heroGrid.arrange();
					
					let heroCount = heroGrid.filteredItems.length;
					if (heroCount > heroes.length) {
						heroCount = heroes.length;
					}
					document.querySelector('.hero-count span').innerHTML = heroCount;

				});

			});

			let searchBox = document.querySelector('.search');

			searchBox.addEventListener('keyup', debounce(function() {

				let value = searchBox.value;

				if (!(/^[A-Za-z0-9\s]*$/.test(value))) {
					value = '';
					searchBox.value = 'Invalid Search!';
					setTimeout(function(){
						searchBox.value = '';
					}, 700);
				}

				if (value.length) {
					searchBox.classList.add('checked')
				} else {
					searchBox.classList.remove('checked')
				}

				searchRE = new RegExp(value,"gi");

				heroGrid.arrange();

				let heroCount = heroGrid.filteredItems.length;
				if (heroCount > heroes.length) {
					heroCount = heroes.length;
				}
				document.querySelector('.hero-count span').innerHTML = heroCount;

			}));

			function debounce( fn, threshold ) {
				var timeout;
				return function debounced() {
				  if ( timeout ) {
					clearTimeout( timeout );
				  }
				  function delayed() {
					fn();
					timeout = null;
				  }
				  timeout = setTimeout( delayed, threshold || 100 );
				}
			}

		});

	}

	function createHeroes() {

		document.querySelector('.heroes-wrapper').innerHTML = '';

		let heroScaffold = document.createElement('div');
		heroScaffold.classList.add('w-full');
		heroScaffold.classList.add('heroes');
		heroScaffold.classList.add('row');

		let heroIterator = 0;

		for (var i = 0, n = heroes.length; i < n; i++) {
			let hero = heroes[i];

			let heroName = hero[0],
			heroTeam = hero[1],
			heroRole = hero[2],
			heroTier = hero[3][0][0],
			heroDisk = hero[3][0][1],
			heroMods1 = hero[3][1],
			heroMods2 = hero[3][2];
			heroSubclasses = hero[4];

			if (isEmerald && hero[5]) {
				heroTier = hero[5][0][0];
				heroDisk = hero[5][0][1];
				heroMods1 = hero[5][1];
				heroMods2 = hero[5][2];
			}

			let mod1 = heroMods1[0],
			modtype1;
			if (mod1.includes('skill')) {
				modtype1 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
			} else if (mod1.includes('crit') || mod1.includes('speed')) {
				modtype1 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
			} else {
				modtype1 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
			}

			let mod2 = heroMods1[1],
			modtype2;
			if (mod2.includes('skill')) {
				modtype2 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
			} else if (mod2.includes('crit') || mod2.includes('speed')) {
				modtype2 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
			} else {
				modtype2 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
			}

			let mod3 = heroMods1[2],
			modtype3;
			if (mod3.includes('skill')) {
				modtype3 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
			} else if (mod3.includes('crit') || mod3.includes('speed')) {
				modtype3 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
			} else {
				modtype3 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
			}

			let mod4 = heroMods1[3],
			modtype4;
			if (mod4.includes('skill')) {
				modtype4 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
			} else if (mod4.includes('crit') || mod4.includes('speed')) {
				modtype4 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
			} else {
				modtype4 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
			}

			let heroTile = document.createElement('div');

			let heroMods = [heroMods1[0].replace(/ /g,"-"), heroMods1[1].replace(/ /g,"-"), heroMods1[2].replace(/ /g,"-"), heroMods1[3].replace(/ /g,"-")];
			let uniqueMods = [...new Set(heroMods)].join(' ');

			heroTile.setAttribute('class', `hero w-full md:w-1/2 lg:w-1/3 3xl:w-1/4 py-6 md:p-6 ${heroTeam} ${heroRole} ${heroTier} ${uniqueMods}`);
			heroTile.setAttribute('title', `${heroName}`);
			heroTile.dataset.team = heroTeam;
			heroTile.dataset.role = heroRole;
			heroTile.dataset.pinned = 'false';

			let modSet2 = '',
			togglers = '';

			if (heroMods2) {

				togglers = `
				<div class="toggles absolute bottom-0 right-0 p-3 row">
					<span class="active">Set 1</span>
					<span>Set 2</span>
				</div>
				`;

				let mod5 = heroMods2[0],
				modtype5;
				if (mod5.includes('skill')) {
					modtype5 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
				} else if (mod5.includes('crit') || mod5.includes('speed')) {
					modtype5 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
				} else {
					modtype5 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
				}
		
				let mod6 = heroMods2[1],
				modtype6;
				if (mod6.includes('skill')) {
					modtype6 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
				} else if (mod6.includes('crit') || mod6.includes('speed')) {
					modtype6 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
				} else {
					modtype6 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
				}
		
				let mod7 = heroMods2[2],
				modtype7;
				if (mod7.includes('skill')) {
					modtype7 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
				} else if (mod7.includes('crit') || mod7.includes('speed')) {
					modtype7 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
				} else {
					modtype7 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
				}
		
				let mod8 = heroMods2[3],
				modtype8;
				if (mod8.includes('skill')) {
					modtype8 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#diamond"></use></svg>`;
				} else if (mod8.includes('crit') || mod8.includes('speed')) {
					modtype8 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#square"></use></svg>`;
				} else {
					modtype8 = `<svg class="text-${heroTeam}-team" decoding="async"><use xlink:href="#circle"></use></svg>`;
				}

				modSet2 = `
					<div class="mods set-2 row capitalize text-center absolute top-0 left-0 w-full h-full bg-blue-light z-10">
						<div class="w-1/2 p-4" title="${heroMods2[0].replace(/-/g, ' ')}">
							${heroMods2[0].replace(/-/g, ' ')}
							${modtype5}
						</div>
						<div class="w-1/2 p-4" title="${heroMods2[1].replace(/-/g, ' ')}">
							${heroMods2[1].replace(/-/g, ' ')}
							${modtype6}
						</div>
						<div class="w-1/2 p-4" title="${heroMods2[2].replace(/-/g, ' ')}">
							${heroMods2[2].replace(/-/g, ' ')}
							${modtype7}
						</div>
						<div class="w-1/2 p-4" title="${heroMods2[3].replace(/-/g, ' ')}">
							${heroMods2[3].replace(/-/g, ' ')}
							${modtype8}
						</div>
					</div>
				`
			}

			let heroImageUrl = `./img/heroes/hero_list_${hero[0].toLowerCase().replace(/ /g,"_").replace(/\&/g,"").replace(/__/g,"_").replace(/,/g,"")}.jpg`;

			if (savedPins.length && savedPins.includes(`${hero[0]}`)) {
				heroTile.dataset.pinned = true;
			}

			let subClasses = '';

			if (isEmerald == true && heroSubclasses) {
				subClasses = `
					<hr>

					<div class="details subclasses capitalize row text-center">
						<div class="w-1/2 p-2" title="${heroSubclasses[0]} Subclass">
							<p>${heroSubclasses[0]}</p>
						</div>
						<div class="w-1/2 p-2 row items-center justify-center" title="${heroSubclasses[1]} Subclass">
							<p>${heroSubclasses[1]}</p>
						</div>
					</div>
				`
			}

			heroTile.innerHTML = `
				<div class="inner h-full bg-blue-light p-6 rounded-lg">

					<div class="name font-bold row">
						<h3 class="flex-1 relative">${heroName} <span>${heroTier.replace(/-/g, ' ')}</span>
							${togglers}
						</h3>
						<figure class="w-1/4 relative">
							<div class="disk absolute top-0 right-0 flex items-center justify-center"><p>${heroDisk}</p></div>
							<img decoding="async" loading="lazy" src="${heroImageUrl}" alt="${heroName}" onerror="this.onerror=null;this.src='./img/fallback.jpg';">
						</figure>
					</div>

					<hr>

					<div class="details capitalize row text-center">
						<div class="w-1/2 p-2 bg-${heroTeam}-team" title="${heroTeam} team">
							<p>${heroTeam} Team</p>
						</div>
						<div class="w-1/2 p-2 row items-center justify-center" title="${heroRole} role">
							<p>${heroRole}</p>
							<svg decoding="async"><use xlink:href="#${heroRole}"></use></svg>
						</div>
					</div>

					${subClasses}

					<hr>

					<div class="mods relative mt-6 row capitalize text-center">
						<div class="w-1/2 p-4" title="${heroMods[0].replace(/-/g, ' ')}">
							${heroMods[0].replace(/-/g, ' ')}
							${modtype1}
						</div>
						<div class="w-1/2 p-4" title="${heroMods[1].replace(/-/g, ' ')}">
							${heroMods[1].replace(/-/g, ' ')}
							${modtype2}
						</div>
						<div class="w-1/2 p-4" title="${heroMods[2].replace(/-/g, ' ')}">
							${heroMods[2].replace(/-/g, ' ')}
							${modtype3}
						</div>
						<div class="w-1/2 p-4" title="${heroMods[3].replace(/-/g, ' ')}">
							${heroMods[3].replace(/-/g, ' ')}
							${modtype4}
						</div>
						${modSet2}
					</div>

				</div>
			`;
			
			heroScaffold.appendChild(heroTile);

			heroTile.addEventListener('click', function(e) {
				if (!e.target.closest('.toggles')) {
					let heroName = hero[0];
					if (e.target.closest('.hero').dataset.pinned == 'true') {
						e.target.closest('.hero').dataset.pinned = 'false';
					} else {
						e.target.closest('.hero').dataset.pinned = 'true';
					}
					togglePinState(heroName, savedPins);
				}
			});

			heroIterator++;
			/*if (heroIterator === heroes.length) {
				filterFunctions();
			}*/

		};
		document.querySelector('.heroes-wrapper').appendChild(heroScaffold);
		filterFunctions();
		if (document.body.matches('.loading-heroes')) {
			setTimeout(function() {
				document.body.classList.remove('loading-heroes');
			}, 1000);
		}
	}
	createHeroes();

	let setToggles = document.querySelectorAll('.toggles');

	Array.from(setToggles).forEach(function(toggle) {

		toggle.addEventListener('click', function(e) {

			let set = e.target.closest('span');

			set.classList.add('active');
			let setIndex = [...set.parentElement.children].indexOf(set);

			if (setIndex === 0) {
				toggle.querySelector('span:nth-child(2)').classList.remove('active');
				toggle.closest('.inner').querySelector('.set-2').classList.remove('active');
			} else {
				toggle.querySelector('span:first-child').classList.remove('active');
				toggle.closest('.inner').querySelector('.set-2').classList.add('active');
			}

		});

	});

	/*emeralder.addEventListener('change', function(e) {
		isEmerald = e.target.checked;
		document.body.dataset.emerald = isEmerald;
		document.body.classList.add('loading-heroes');

		setTimeout(function() {
			createHeroes(heroes);
			localStorage.setItem('emerald', JSON.stringify(isEmerald));
		}, 1000);
	});*/

	if ( window.innerWidth >= 1024 || window.innerWidth > window.innerHeight ) {
		const cursor = curDot({
			zIndex: 100000,
			diameter: 14,
			easing: 6,
			borderWidth: 1,
			borderColor: '#fff',
			background: '#fff',
			blendMode: 'normal'
		});

		cursor.over('.hero', {
			background: 'transparent',
		});
	}

	console.log('%c🦊 coded by Pipsqueak', 'font-family: sans-serif, font-size: 40px; color: #fff; background: #3806a5; padding: 5px 10px; margin: 5px 0;');

});