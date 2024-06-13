/** define */
const iconWidth = 100;
const iconHeight = 128;
const moonOriginX = 50;
const moonOriginY = 50;
const moonRadius = 40;
const fontSize = 16;
const textColor = '#f9f9ff';
const iconBacgroundColor = '#2f3136';
const moonShadowColor = '#191970';
const moonLightColor = '#f7e193';

function createMoonIcon(moonage) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "150");
    svg.setAttribute("viewbox", "0 0 100 150");
    svg.setAttribute("class", "moonIcon");

    /** icon background */
    const bg = document.createElementNS('http://www.w3.org/2000/svg','rect');
    bg.setAttribute('x', 0);
    bg.setAttribute('y', 0);
    bg.setAttribute('width', iconWidth);
    bg.setAttribute('height', iconHeight);
    bg.setAttribute('fill', iconBacgroundColor);
    svg.appendChild(bg);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x', '50%');
    text.setAttribute('y',114);
    text.setAttribute('fill', textColor);
    text.setAttribute('font-size', fontSize);
    text.setAttribute('text-anchor', 'middle');
    text.classList.add('fontset');
    text.textContent = '月齢: ' + moonage;
    svg.appendChild(text);

    const moonlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    moonlight.setAttribute('cx', moonOriginX);
    moonlight.setAttribute('cy', moonOriginY);
    moonlight.setAttribute('r', moonRadius);
    moonlight.setAttribute('fill', moonLightColor);
    
    svg.appendChild(moonlight);
    
    let moon_age_floor = Math.round(moonage);
    
    /** new moon */
    if (1 > moonage) {
        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        moonshadow.setAttribute('cx', moonOriginX);
        moonshadow.setAttribute('cy', moonOriginY);
        moonshadow.setAttribute('r', moonRadius);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);
    } else if (8 > moon_age_floor) {
        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow.setAttribute('d', `M ${moonOriginX} 90 a ${moonRadius} 40 90 0 1 0,-80`);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);
        
        let r = (64 - (8*moon_age_floor)) >= moonRadius ? moonRadius: 64 - (8*moon_age_floor);

        const moonshadow2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow2.setAttribute('d', `M ${moonOriginX},10 a ${moonRadius} ${r} 270 0 1 0,80`);
        moonshadow2.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow2);
        
    } else if (8 === moon_age_floor) {
        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow.setAttribute('d', `M ${moonOriginX} 90 a ${moonRadius} 40 90 0 1 0,-80`);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);
    } else if (8 < moon_age_floor && 15 > moon_age_floor) {
        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow.setAttribute('d', `M ${moonOriginX} 90 a ${moonRadius} 40 90 0 1 0,-80`);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);
        
        let r = (64 - (8*(15-moon_age_floor))) >= moonRadius ? moonRadius : 64 - (8*(15-moon_age_floor));

        const moonlight2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonlight2.setAttribute('d', `M ${moonOriginX} 90 a ${moonRadius} ${r} 90 0 1 0,-80`);
        moonlight2.setAttribute('fill', moonLightColor);
        svg.appendChild(moonlight2);
        
    } else if (15 == moon_age_floor) {
        return svg
    } else if (15 < moon_age_floor && 21 > moon_age_floor) {
        
        let r = (8*(21 - moon_age_floor)) < 0 ? 0 : 8*(21 - moon_age_floor);

        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow.setAttribute('d', `M ${moonOriginX} 10 a ${moonRadius} 40 -90 0 1 0,80`);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);
        
        const moonlight2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonlight2.setAttribute('d', `M ${moonOriginX} 10 a ${moonRadius} ${r} -90 0 1 0,80`);
        moonlight2.setAttribute('fill', moonLightColor);
        svg.appendChild(moonlight2);
        
    } else if (21 === moon_age_floor) {
        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow.setAttribute('d', `M ${moonOriginX} 10 a ${moonRadius} 40 -90 0 1 0,80`);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);
    } else {
        const moonshadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow.setAttribute('d', `M ${moonOriginX} 10 a ${moonRadius} 40 -90 0 1 0,80`);
        moonshadow.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow);

        let r = (40 - (8*(29-moon_age_floor))) < 0 ? 0 : (40 - (8*(29-moon_age_floor))) > 40 ? 40 : 40 - (8*(29-moon_age_floor));
        const moonshadow2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonshadow2.setAttribute('d', `M ${moonOriginX} 90 a ${moonRadius} ${r} 90 0 1 0,-80`);
        moonshadow2.setAttribute('fill', moonShadowColor);
        svg.appendChild(moonshadow2);
    }
    
    
    return svg
}

export {createMoonIcon};

/** end of file */
