desc "Put all of Jasmine for webOS into one file"
task :concat_sources do

  puts 'Building Jasmine webOS distribution file'.yellow

  sources = build_sources

  FileUtils.mkdir_p('plugins/jasmine-webos/app/lib')

  old_files = Dir.glob('plugins/jasmine-webos/app/lib/*.js')
  old_files.each { |file| File.delete(file) }

  File.open("plugins/jasmine-webos/app/lib/jasmine-webos.js", 'w') do |single_file|
    sources.each do |source_filename|
      puts "Adding #{source_filename} to jasmine-webos.js"
      single_file.puts(File.read(source_filename))
    end

    single_file.puts %{
jasmine.webos.version = {
  "major": #{version_data['major']},
  "minor": #{version_data['minor']},
  "build": #{version_data['build']},
  "revision": #{version_data['revision']}
};
}
  end
end

desc "Make a zip file that contains the entire Jasmine webOS plugin"
task :build => :concat_sources do

  require 'tmpdir'

  temp_dir = File.join(Dir.tmpdir, 'jasmine-webos-plugin')
  puts "Building Jasmine webOS plugin in #{temp_dir}".yellow
  FileUtils.rm_r temp_dir if File.exists?(temp_dir)

  build_root = File.join(temp_dir, 'plugins/jasmine-webos')
  FileUtils.mkdir_p(build_root)

  plugin_root = File.join(File.expand_path(File.dirname(__FILE__)), '..', 'plugins/jasmine-webos')
  ['app', 'images', 'stylesheets', 'sources.json'].each do |path|
    FileUtils.cp_r File.join(plugin_root, path), build_root
  end

  zip_file_name = File.join("#{plugin_root}/..", "jasmine-webos-plugin-#{version_string}.zip")

  if File.exist?(zip_file_name)
    puts "WARNING!!! #{zip_file_name} already exists!"
    FileUtils.rm(zip_file_name)
  end

  puts "Zipping Jasmine webOS plugin to plugins/jasmine-webos-plugin-#{version_string}.zip".yellow
  exec "cd #{temp_dir} && zip -r #{zip_file_name} . -x .[a-zA-Z0-9]*"
  exec "ls -alF plugins/*.zip"
end

def build_sources
  jasmine_webos_source_dir = 'plugins/jasmine-webos/src'
  sources = [File.join(jasmine_webos_source_dir, 'jasmine-webos-core.js'),
             File.join(jasmine_webos_source_dir, 'proxy-app-assistant.js')]
  sources += Dir.glob("#{jasmine_webos_source_dir}/*.js").reject { |f| sources.include?(f) }.sort
  sources
end

def version_string
  "#{version_data['major']}.#{version_data['minor']}.#{version_data['build']}"
end

def version_data
  @version ||= begin
    appinfo = JSON.parse(File.new("appinfo.json").read)
    v = appinfo['version'].split('.')
    { 'major' => v[0], 'minor' => v[1], 'build' => v[2], 'revision' => Time.now.to_i }
  end
end

def root
  File.expand_path(File.dirname(__FILE__))
end
