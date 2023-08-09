const LIME_PRODUCTS = [
    {
        title: 'РУБАШКА OVERSIZE',
        price: '3599 ₽',
        image_src: 'assets/1.png',
        brand_src: 'assets/lime.png',
    },
    {
        title: 'ОДНОБОРТНЫЙ БЛЕЙЗЕР ПРЯМОГО КРОЯ',
        price: '9999 ₽',
        image_src: 'assets/2.png',
        brand_src: 'assets/lime.png',
    },
    {
        title: 'СЕТЧАТОЕ ПЛАТЬЕ МИДИ С ПРИНТОМ',
        price: '3599 ₽',
        image_src: 'assets/3.png',
        brand_src: 'assets/lime.png',
    },
    {
        title: 'ОДНОБОРТНЫЙ БЛЕЙЗЕР ПРЯМОГО КРОЯ',
        price: '9999 ₽',
        image_src: 'assets/2.png',
        brand_src: 'assets/lime.png',
    },
]

const PRODUCT_ANIMATION_DELAY = 4000;

class Slider {
    #sliderContainer

    constructor(products, parentBlock) {
        this.parentBlock = parentBlock;
        this.#sliderContainer = new CardsSlider(products);
    }

    create() {
        const sliderContainerHTML = this.#sliderContainer.renderCardStage();
        const dotsContainerHTML = this.#sliderContainer.renderDots();

        const cardsStage = document.createElement('div');
        cardsStage.className = 'cards-slider';
        cardsStage.append(sliderContainerHTML, dotsContainerHTML);


        this.parentBlock.append(cardsStage);
        this.#sliderContainer.slideShowStart();
    }
}

class CardsSlider {
    #cardStageContainer
    #dotsContainer

    constructor(cardsArray) {
        this.cardsArray = cardsArray;
        this.#cardStageContainer = document.createElement('div');
        this.#cardStageContainer.className = 'cards-stage';
        this.#dotsContainer = document.createElement('div');
        this.#dotsContainer.className = 'dots';
        this.cards = null;
        this.dots = null;
    }

    renderCardStage() {
        this.cardsArray.forEach((product, productIndex) => {
            let initClassName;
            if (productIndex === 0) initClassName = 'on-stage';
            else if (productIndex === 1) initClassName = 'prepare-to-stage';
            else initClassName = 'reserve-to-stage';
            const productCard = new ProductCard(product, initClassName);
            const productCardHTML = productCard.renderCard();
            this.#cardStageContainer.append(productCardHTML);
        });
        return this.#cardStageContainer;
    };

    renderDots() {
        for (let i = 0; i < this.cardsArray.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', this.#dotClickHandler.bind(this));
            this.#dotsContainer.append(dot);
        }
        this.#dotsContainer.querySelector('.dot').classList.add('active');

        return this.#dotsContainer;
    }

    slideShowStart() {
        this.cards = this.#cardStageContainer.querySelectorAll('.card');
        this.dots = this.#dotsContainer.querySelectorAll('.dot');
        let currentIndexArray = [...Array(this.cardsArray.length).keys()];

        setInterval(() => {
            this.#showCardAndDot(currentIndexArray, this.cards, this.dots);
            const firstIndex = currentIndexArray.shift();
            currentIndexArray.push(firstIndex);
        }, PRODUCT_ANIMATION_DELAY);
    }

    #showCardAndDot(indexArr, cards, dots) {
        cards.forEach((card, cardIndex) => {
            card.classList.remove('on-stage', 'reserve-to-stage', 'prepare-to-stage');
            // cardIndex === indexArr[0] ? card.classList.add('on-stage') : cardIndex === indexArr[1] ? card.classList.add('prepare-to-stage') : card.classList.add('prepare-to-stage');
            if (cardIndex === indexArr[0]) card.classList.add('on-stage');
            else if (cardIndex === indexArr[1]) card.classList.add('prepare-to-stage');
            else card.classList.add('reserve-to-stage');
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.remove('active');
            if (dotIndex === indexArr[0]) dot.classList.add('active');
        })
    }

    #dotClickHandler(e) {
        const dot = e.target;
        const dotIndex = [...e.target.parentNode.children].findIndex(node => node === dot);
        const baseIndexArray = [...Array(this.cardsArray.length).keys()];
        const newIndexArray = [...baseIndexArray.splice(dotIndex), ...baseIndexArray.splice(0,dotIndex)];
        this.#showCardAndDot(newIndexArray, this.cards, this.dots);
    }
}

class ProductCard {
    #productCardContainer

    constructor(product, initClass) {
        this.product = product;
        this.initClass = initClass;
        this.#productCardContainer = document.createElement('div');
        this.#productCardContainer.classList.add('card', this.initClass);
    }

    renderCard() {
        const {title, price, image_src, brand_src} = this.product;

        const cardPicture = document.createElement('div');
        cardPicture.className = 'card-picture';
        cardPicture.innerHTML = `<div class="card-picture__image">
                                    <img src=${image_src} alt="n/a">
                                </div>
                                <div class="card-picture__brand">
                                    <img src=${brand_src} alt="n/a">
                                </div>`;

        const cardInfo = document.createElement('div');
        cardInfo.className = 'card-info';
        cardInfo.innerHTML = `<div class="card-info__title">${title}</div>
                              <div class="card-info__price">${price}</div>`;

        this.#productCardContainer.append(cardPicture, cardInfo);

        return this.#productCardContainer;
    }
}

let slider = new Slider(LIME_PRODUCTS, document.body);
slider.create();
