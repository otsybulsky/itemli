use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
#
# In order to use HTTPS in development, a self-signed
# certificate can be generated by running the following
# command from your terminal:
#
#     openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" -keyout priv/server.key -out priv/server.pem
#
# The `http:` config below can be replaced with:
# https: [port: 4000, keyfile: "priv/server.key", certfile: "priv/server.pem"],
#
# If desired, both `http:` and `https:` keys can be
# configured to run both http and https servers on
# different ports.
config :itemli, Itemli.Endpoint, 
  force_ssl: [hsts: true],
  http: [port: 80],
  https: [port: 443, keyfile: "priv/keys/localhost.key",
  certfile: "priv/keys/localhost.crt"],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [node: ["node_modules/brunch/bin/brunch", "watch", "--stdin",
                    cd: Path.expand("../assets", __DIR__)]]


# Watch static and templates for browser reloading.
config :itemli, Itemli.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :itemli, Itemli.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "itemli_dev",
  hostname: "localhost",
  pool_size: 10

config :cors_plug,
  origin: ~r/^.*-extension:/,
  max_age: 86400,
  methods: ["GET", "POST"]



config :ueberauth, Ueberauth.Strategy.Facebook.OAuth,
  client_id: System.get_env("ITEMLI_FACEBOOK_ID") ,
  client_secret: System.get_env("ITEMLI_FACEBOOK_SECRET")

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("ITEMLI_GITHUB_ID"),
  client_secret: System.get_env("ITEMLI_GITHUB_SECRET") 

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: System.get_env("ITEMLI_GOOGLE_ID"),
  client_secret: System.get_env("ITEMLI_GOOGLE_SECRET")

config :itemli,
  token_secret: System.get_env("ITEMLI_TOKEN_SECRET")

  