desc "run tests on Palm webOS Emulator"
task :test => [:concat_sources, :sources] do
  system('palm-package -o .. .')

  app_id = get_app_id
  location = 'tcp'

  puts "Installing #{app_id} at #{location}".yellow
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

desc "Make a sources.json file that includes Jasmine, Jasmine webOS, and Jasmine webOS's specs"
task :sources do
  @sources_json = JSON.parse(File.new("app-sources.json").read);

  @sources_json << { 'source' => 'spec/lib/jasmine.js' }
  @sources_json << { 'source' => 'plugins/jasmine-webos/app/lib/jasmine-webos.js' }

  paths = Dir.chdir('.') { |dir| Dir.glob("plugins/jasmine-webos/spec/app/**/*.js") }

  paths.each do |path|
    @sources_json << { 'source' => path }
  end

  File.open('sources.json', 'w') do |f|
    f << JSON.pretty_generate(@sources_json)
  end
end

task :default => :test

