# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_akita_no_omatsuri_session',
  :secret      => 'f3a4a8eeda2bbc94725544ad859303853b8261fe653a2716f77faed209ef10d2d86ab9731bfc32e7484eed4b56b13bc7570460c4b3742e66d7976f43fcbddd7f'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
