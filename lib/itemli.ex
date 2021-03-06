defmodule Itemli do
  use Application

  defp poolboy_config do
    [{:name, {:local, :worker_article}}, {:worker_module, MetaInspector}, {:size, 5}, {:max_overflow, 2}]
  end

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Itemli.Repo, []),
      # Start the endpoint when the application starts
      supervisor(Itemli.Endpoint, []),
      # Start your own worker by calling: Itemli.Worker.start_link(arg1, arg2, arg3)
      # worker(Itemli.Worker, [arg1, arg2, arg3]),      
      :poolboy.child_spec(:worker_article, poolboy_config(), [])
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Itemli.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Itemli.Endpoint.config_change(changed, removed)
    :ok
  end
end
