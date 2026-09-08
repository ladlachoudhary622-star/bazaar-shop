describe('Frontend - Product Search', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000');
    });

    it('should search for products', () => {
        cy.get('#searchInput').type('Wireless Earbuds');
        cy.get('#searchBtn').click();
        cy.get('#productGrid').children().should('have.length.greaterThan', 0);
    });

    it('should filter by category', () => {
        cy.get('#categoryFilter').select('Electronics');
        cy.get('#productGrid').children().each(($el) => {
            expect($el).to.contain('Electronics');
        });
    });

    it('should add product to cart', () => {
        cy.contains('Add To Cart').first().click();
        cy.get('#cartCount').should('contain', '1');
    });
});

describe('Frontend - Shopping Cart', () => {
    it('should update cart on add', () => {
        cy.visit('http://localhost:5000');
        cy.contains('Add To Cart').first().click();
        cy.get('#cartCount').should('contain', '1');
    });

    it('should remove item from cart', () => {
        cy.visit('http://localhost:5000');
        cy.contains('Add To Cart').first().click();
        cy.get('button').contains('My Cart').parent().click();
        cy.contains('fa-trash').click();
        cy.get('#cartCount').should('contain', '0');
    });
});

describe('Frontend - Login', () => {
    it('should open login modal', () => {
        cy.visit('http://localhost:5000');
        cy.contains('Login / Sign Up').click();
        cy.get('#loginModal').should('not.have.class', 'hidden');
    });

    it('should submit login form', () => {
        cy.visit('http://localhost:5000');
        cy.contains('Login / Sign Up').click();
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('password123');
        cy.contains('button', 'Login').click();
    });
});
