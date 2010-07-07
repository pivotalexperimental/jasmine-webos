
desc "Put all of Jasmine for webOS into one file"
task :concat_sources do

  puts 'Building Jasmine webOS from source'

  sources = build_sources

  old_files = Dir.glob('app/lib/*.js')
  old_files.each { |file| File.delete(file) }

  File.open("app/lib/jasmine-webos.js", 'w') do |single_file|
    sources.each do |source_filename|
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

  zip_file_name = File.join(temp_dir, "jasmine-webos-plugin-#{version_string}.zip")
  puts "Zipping Plugin and moving to #{zip_file_name}"

  if File.exist?(zip_file_name)
    puts "WARNING!!! #{zip_file_name} already exists!"
    FileUtils.rm(zip_file_name)
  end

  exec "cd #{temp_dir} && zip -r #{zip_file_name} . -x .[a-zA-Z0-9]*"
end


def build_sources
  sources = ['src/jasmine-webos-core.js', 'src/proxy-app-assistant.js']
  sources += Dir.glob('src/*.js').reject { |f| sources.include?(f) }.sort
  sources
end

def version_string
  "#{version_data['major']}.#{version_data['minor']}.#{version_data['build']}"
end

def version_data
  require 'json'
  @version ||= JSON.parse(File.new("src/version.json").read);
end

