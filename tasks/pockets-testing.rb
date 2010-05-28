require 'JSON'

task :default => :test

namespace :sources do
  task :test do
    generate_sources(:test => true)
  end

  task :production do
    generate_sources()
  end

  task :pockets do
    generate_sources({:pockets => true})
  end
end

task :sources => ['sources:test']

namespace :test do
  task :app => ['sources:test', 'install', 'launch_tests']

  desc 'run pockets tests on emulator'
  task :pockets => ['sources:pockets', 'install', 'launch']
end

desc "Run on emulator"
task :run => ['sources:production', 'install', 'launch']

task :launch_tests do
  launch(true)
end

task :launch do
  launch(false)
end

desc 'run tests on emulator'
task :test => ['test:app']

task :install do
  puts system('palm-package --exclude-from=exclude.txt -o .. .')
  puts system("palm-install -r #{app_id}")
  puts system("palm-install ../#{app_id}_#{version}_all.ipk")
end

def launch(run_tests=false)
  puts system(%Q(palm-launch #{app_id} -p '{"runTests": #{run_tests ? 'true':'false'}}'))
end

def app_info
  @app_info ||= JSON.parse(File.open('appinfo.json').read)
end

def app_id
  app_info['id']
end

def version
  app_info['version']
end

def generate_sources(opts = {})
  sources_yaml = YAML.load_file('sources.yaml') if File.exists?('sources.yaml')
  load_first = sources_yaml['load_first'] || []

  app_files = Dir.glob('app/**/*.js')

  test_files = []
  pockets_testing_path = "plugins/pockets-testing"

  if (opts[:test])
    test_load_first = sources_yaml['test']['load_first'] || []
    test_suites = Dir.glob("test/**/*.js")
    test_files = pockets_testing_framework(pockets_testing_path) + test_load_first + test_suites
  elsif (opts[:pockets])
    test_suites = Dir.glob("#{pockets_testing_path}/test/**/*.js")
    test_files = pockets_testing_framework(pockets_testing_path) + test_suites
  end

  files_to_load = load_first + ((app_files + test_files) - load_first)

  sources = files_to_load.collect { |filepath| {"source" => filepath}}
  File.open("sources.json", "w") do |file|
    file << JSON.pretty_generate(sources)
  end
end

def pockets_testing_framework(pockets_testing_path)
  test_framework_sources_yaml = YAML.load_file("#{pockets_testing_path}/sources.yaml") if File.exists?("#{pockets_testing_path}/sources.yaml")
  test_framework_load_first = test_framework_sources_yaml['load_first'] || []
  test_framework_load_first.collect!{ |filepath| "#{pockets_testing_path}/#{filepath}"}
  test_framework_load_first + (Dir.glob("#{pockets_testing_path}/app/**/*.js") - test_framework_load_first)
end

def deploy (emulator = false)
end