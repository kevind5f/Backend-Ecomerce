CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  oauth_provider VARCHAR(50) NOT NULL,
  oauth_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_oauth UNIQUE (oauth_provider, oauth_id),
  CONSTRAINT uq_email UNIQUE (email)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),
  currency VARCHAR(10) DEFAULT 'PEN',
  culqi_charge_id VARCHAR(255),
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payment_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

CREATE TABLE payment_products (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),

  CONSTRAINT fk_pp_payment 
    FOREIGN KEY (payment_id) 
    REFERENCES payments(id) 
    ON DELETE CASCADE,

  CONSTRAINT fk_pp_product 
    FOREIGN KEY (product_id) 
    REFERENCES products(id)
);

CREATE TABLE refunds (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_refund_payment 
    FOREIGN KEY (payment_id) 
    REFERENCES payments(id) 
    ON DELETE CASCADE
);


CREATE TABLE providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
