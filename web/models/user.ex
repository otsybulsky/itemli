defmodule Itemli.User do
    use Itemli.Web, :model

    schema "users" do
        field :email, :string
        field :name, :string
        field :provider, :string
        field :token, :string

        has_many :articles, Itemli.Article

        timestamps()
    end

    def changeset(struct, params \\ %{}) do
        struct
        |> cast(params, [:email, :name, :provider, :token])
        |> validate_required([:email, :provider, :token])
    end
end