defmodule Itemli.Plugs.RequireAuth do
    import Plug.Conn
    import Phoenix.Controller

    alias Itemli.Router.Helpers

    def init(_params) do
          
    end

    def call(conn, _from_init) do
        if conn.assigns[:user] do
            conn
        else
            conn
            #|> put_flash(:error, "You must be logged in.")
            |> redirect(to: Helpers.main_path(conn, :index))   
            |> halt() 
        end
    end
end