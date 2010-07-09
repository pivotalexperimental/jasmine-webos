require 'json'
require 'colored'

task :default => :test

desc "run tests on Palm webOS Emulator"
task :test => :sources do
  system('palm-package -o .. .')

  app_id = get_app_id
  location = 'tcp'

  puts "Installing #{app_id} at #{location}".yellow.bold
  system("find .. -name '#{app_id}*.ipk'| xargs palm-install --device #{location} ")

  run_tests = '{"runTests": true}'
  launch_command = "palm-launch -i --device #{location} -p '#{run_tests}' #{app_id}"

  puts launch_command
  system(launch_command)
end

def get_app_id
  app_info = File.open("appinfo.json", "r") { |f| JSON.load(f) }
  app_info['id']
end

namespace :jasmine do
  task :require do
    require 'jasmine'
  end

  desc "Run continuous integration tests"
  task :ci => "jasmine:require" do
    require "spec"
    require 'spec/rake/spectask'

    Spec::Rake::SpecTask.new(:jasmine_continuous_integration_runner) do |t|
      t.spec_opts = ["--color", "--format", "specdoc"]
      t.verbose = true
      t.spec_files = ['spec/javascripts/support/jasmine_runner.rb']
    end
    Rake::Task["jasmine_continuous_integration_runner"].invoke
  end

  task :server => "jasmine:require" do
    jasmine_config_overrides = 'spec/javascripts/support/jasmine_config.rb'
    require jasmine_config_overrides if File.exists?(jasmine_config_overrides)

    puts "your tests are here:"
    puts "  http://localhost:8888/run.html"

    Jasmine::Config.new.start_server
  end
end

desc "Run specs via server"
task :jasmine => ['jasmine:server']

#############
desc "Put all of Jasmine for webOS into one file"
task :concat_sources do

  puts 'Building Jasmine webOS from source'

  sources = build_sources

  FileUtils.mkdir_p('plugins/jasmine-webos/app/lib')

  old_files = Dir.glob('plugins/jasmine-webos/app/lib/*.js')
  old_files.each { |file| File.delete(file) }

  File.open("plugins/jasmine-webos/app/lib/jasmine-webos.js", 'w') do |single_file|
    sources.each do |source_filename|
      puts "Adding #{source_filename} to jasmine-webos.js".yellow
      single_file.puts(File.read(source_filename))
    end

    single_file.puts %{
jasmine.webos.version = {
  "major": #{version_data['major']},
  "minor": #{version_data['minor']},
  "build": #{version_data['build']},
  "revision": #{Time.now.to_i}
};
}
  end
end

desc "Make a zip file that contains the entire plugin"
task :build => :concat_sources do

  require 'tmpdir'

  temp_dir = File.join(Dir.tmpdir, 'jasmine-webos-plugin')
  puts "Building Jasmine webOS plugin in #{temp_dir}"
  FileUtils.rm_r temp_dir if File.exists?(temp_dir)

  plugin_root = File.join(temp_dir, 'plugins/jasmine-webos')
  FileUtils.mkdir_p(plugin_root)

  root = File.expand_path(File.dirname(__FILE__))
  ['app', 'images', 'stylesheets', 'sources.json'].each do |path|
    FileUtils.cp_r File.join(root, path), plugin_root
  end

  zip_file_name = File.join("#{root}/..", "jasmine-webos-plugin-#{version_string}.zip")
  puts "Zipping Plugin and moving to #{zip_file_name}"

  if File.exist?(zip_file_name)
    puts "WARNING!!! #{zip_file_name} already exists!"
    FileUtils.rm(zip_file_name)
  end

  exec "cd #{temp_dir} && zip -r #{zip_file_name} . -x .[a-zA-Z0-9]*"
  exec "mv #{zip_file_name} #{root}/.."
end

def build_sources
#  jasmine_webos_source_dir = File.join(root, 'plugins/jasmine-webos/src')
  jasmine_webos_source_dir = 'plugins/jasmine-webos/src'
  sources = [File.join(jasmine_webos_source_dir, 'jasmine-webos-core.js'),
             File.join(jasmine_webos_source_dir, 'proxy-app-assistant.js')]
  sources += Dir.glob("#{jasmine_webos_source_dir}/*.js").reject { |f| sources.include?(f) }.sort
  sources
end

desc "Make a sources.json file that includes Jasmine, Jasmine webOS, and Jasmine webOS's specs"
task :sources do
  @sources_json = JSON.parse(File.new("app-sources.json").read);

  @sources_json << { 'source' => 'spec/lib/jasmine.js' }
  @sources_json << { 'source' => 'plugins/jasmine-webos/app/lib/jasmine-webos.js' }

  paths = Dir.chdir('.') { |dir| Dir.glob("plugins/jasmine-webos/spec/**/*.js") };

  paths.each do |path|
    @sources_json << { 'source' => path }
  end

  File.open('sources.json', 'w') do |f|
    f << JSON.pretty_generate(@sources_json)
  end
end

def version_string
  "#{version_data['major']}.#{version_data['minor']}.#{version_data['build']}"
end

def version_data
  @version ||= JSON.parse(File.new("plugins/jasmine-webos/version.json").read)
# TODO: Move version to appinfo.json as canonical source
#  @version ||= begin
#    appinfo = JSON.parse(File.new("src/version.json").read)
#    v = appinfo['version'].split('.')
#    { 'major' => v[0], 'minor' => v[1], 'build' => v[2] }
#  end
end

def root
  File.expand_path(File.dirname(__FILE__))
end
